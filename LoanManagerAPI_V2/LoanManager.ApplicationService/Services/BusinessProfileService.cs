using System;
using AutoMapper;
using LoanManager.ApplicationService.Models;
using LoanManager.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using Microsoft.Extensions.Logging;
using LoanManager.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Drawing;
using System.Transactions;
using LoanManager.Shared;
using LoanManager.Configuration;

namespace LoanManager.ApplicationService
{
    public class BusinessProfileService : BaseService, IBusinessProfileService
    {
        private readonly IRepository<BusinessProfile> businessProfileRepository;
        private readonly IStoredProcedureRepository storedProcedureRepository;
        private readonly IHostingEnvironment hostingEnvironment;
        private readonly IRepository<Photo> photoRepository;
        private readonly IPhotoService photoService;

        public BusinessProfileService(IRepository<BusinessProfile> businessProfileRepository, IRepository<Photo> photoRepository, ILogger<BusinessProfileService> logger, IPhotoService photoService, IMapper mapper, IStoredProcedureRepository storedProcedureRepository, ILoggedInUserService loggedInUserService, IHostingEnvironment hostingEnvironment) : base(logger, mapper, loggedInUserService)
        {
            this.businessProfileRepository = businessProfileRepository;
            this.storedProcedureRepository = storedProcedureRepository;
            this.hostingEnvironment = hostingEnvironment;
            this.photoRepository = photoRepository;
            this.photoService = photoService;
        }

        public async Task<LoadResult> GetBusinessProfileListAsync(DataSourceLoadOptionsBase options)
        {
            options.Select = new[] { "Id", "CompanyName", "Phone", "Fax", "Mobile", "Email", "Website", "IsDefault", "IsActive" };
            return await businessProfileRepository.GetDevExpressListAsync(options);
        }

        public async Task<BusinessProfileModel> GetBusinessProfileAsync(long id)
        {
            if (id == 0)
            {
                return new BusinessProfileModel();
            }

            BusinessProfile businessProfile = await businessProfileRepository.Where(x => x.Id == id).Include(x => x.Logo).FirstOrDefaultAsync();

            if (businessProfile == null)
            {
                throw new ItmNotFoundException("Business profile not found");
            }

            if (businessProfile.Logo == null) businessProfile.Logo = new Photo();

            return Mapper.Map<BusinessProfileModel>(businessProfile);
        }

        public async Task<List<SelectModel>> GetBusinessProfileSelectItemsAsync()
        {
            return await Task.Run(()=> businessProfileRepository.Where(x => x.IsActive)
                .Select(x => new SelectModel {
                    Id = x.Id,
                    Name = x.CompanyName,
                    IsDefault = x.IsDefault
                }).ToList());
        }

        public List<TabModel> GetBusinessProfileDetailsTabs(long id)
        {
            List<TabModel> tabModels = new List<TabModel>
            {
                new TabModel(1, "General Information", "generalInformation")
            };

            if (id == 0)
            {
                return tabModels;
            }

            return tabModels;
        }

        public async Task<bool> DeleteBusinessProfilesAsync(List<long> ids)
        {
            if (ids == null)
            {
                throw new ItmArgumentMissingException("Business Profile not found");
            }

            if (!await businessProfileRepository.ExistsAsync(x => ids.Contains(x.Id)))
            {
                throw new ItmArgumentMissingException("Business Profile not found");
            }

            return await businessProfileRepository.DeleteAsync(t => ids.Contains(t.Id)) > 0;
        }

        public async Task<bool> DeleteBusinessProfileByIdAsync(long id)
        {
            if (id < 1)
            {
                throw new ItmArgumentMissingException("Business Profile not found");
            }

            if (!await businessProfileRepository.ExistsAsync(x => x.Id == id))
            {
                throw new ItmArgumentMissingException("Business Profile not found");
            }

            //Check for validation
            var validationSummary = storedProcedureRepository.GetValidationSummary(DeletableEntityType.BusinessProfile, id);
            if (validationSummary != null && !validationSummary.IsValid)
            {
                throw new ItmArgumentMissingException(validationSummary.ValidationMessage);
            }

            return await businessProfileRepository.DeleteAsync(t => t.Id == id) > 0;
        }

        public async Task<long> SaveBusinessProfileAsync(BusinessProfileModel businessProfileModel)
        {
            if (businessProfileModel == null)
            {
                throw new ItmArgumentMissingException("Invalid business profile");
            }

            BusinessProfile dbBP = new BusinessProfile();

            if (!businessProfileModel.Logo.IsUpdated && !businessProfileModel.Logo.IsDeleted)
            {
                businessProfileModel.Logo = null;
            }

            if (businessProfileModel.Id > 0)
            {
                if (businessProfileModel.Logo != null)
                {
                    dbBP = businessProfileRepository.Where(b => b.Id == businessProfileModel.Id).Include(p => p.Logo).FirstOrDefault();
                }
                else
                {
                    dbBP = businessProfileRepository.Where(b => b.Id == businessProfileModel.Id).FirstOrDefault();
                }

                if (dbBP == null)
                {
                    throw new ItmNotFoundException("Business profile not found for edit");
                }
            }


            if (dbBP != null)
            {
                Mapper.Map(businessProfileModel, dbBP);

                if (businessProfileModel.IsDefault)
                {
                    dbBP.IsActive = true;
                    //set default = false for previous default record 
                    businessProfileRepository.Attach(businessProfileRepository
                                                    .Where(x => x.Id != businessProfileModel.Id && x.IsDefault).ToList()
                                                    .Select(x => { x.IsDefault = false; return x; }).FirstOrDefault());
                }


                if (businessProfileModel.LogoId > 0 && businessProfileModel.Logo != null)
                {
                    if (businessProfileModel.Logo.IsDeleted)
                    {
                        dbBP.LogoId = null;
                        dbBP.Logo = null;
                    }
                    else
                    {
                        dbBP.Logo.OrginalFileName = businessProfileModel.Logo.UploadedFileName;
                        dbBP.Logo.PhotoThumb = this.photoService.GetImageFile(businessProfileModel.Logo.UploadedFileName);
                    }
                }
                else if (!string.IsNullOrEmpty(businessProfileModel.Logo?.UploadedFileName))
                {
                    Photo photo = new Photo();
                    photo.PhotoThumb = this.photoService.GetImageFile(businessProfileModel.Logo.UploadedFileName);
                    photo.FileName = businessProfileModel.CompanyName;
                    photo.OrginalFileName = businessProfileModel.Logo.UploadedFileName;
                    photo.IsDefault = true;
                    photo.IsVisibleInPublicPortal = true;
                    //photo.CreatedDateTime = DateTime.UtcNow;
                    //photo.CreatedByContactId = LoggedInUser.ContectId;
                    dbBP.Logo = photo;
                }

                if (businessProfileModel.Id == 0)
                {
                    await businessProfileRepository.CreateAsync(dbBP);
                }
                else
                {
                    await businessProfileRepository.UpdateAsync(dbBP);
                    //Delete logo
                    if (businessProfileModel.Logo != null && businessProfileModel.Logo.IsDeleted)
                    {
                        photoRepository.Delete(p => p.Id == businessProfileModel.Logo.Id);
                    }
                }
            }

            return dbBP.Id;
        }
    }
}
