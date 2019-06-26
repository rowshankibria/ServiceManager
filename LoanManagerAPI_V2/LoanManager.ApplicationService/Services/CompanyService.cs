using AutoMapper;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using LoanManager.ApplicationService.Models;
using LoanManager.Configuration;
using LoanManager.Data;
using LoanManager.Data.Models;
using LoanManager.Shared;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
    public class CompanyService : BaseService, ICompanyService
    {
        private readonly IRepository<Company> companyRepository;
        private readonly IRepository<BusinessProfile> businessProfileRepository;
        private readonly IPhotoService photoService;
        private readonly IRepository<Photo> photoRepository;

        public CompanyService(ILogger<CompanyService> logger, 
                              IRepository<Company> companyRepository, 
                              IMapper mapper, 
                              ILoggedInUserService loggedInUserService, 
                              IPhotoService photoService, 
                              IRepository<Photo> photoRepository,
                              IRepository<BusinessProfile> businessProfileRepository) : base(logger, mapper, loggedInUserService)
        {
            this.companyRepository = companyRepository;            
            this.photoService = photoService;
            this.photoRepository = photoRepository;
            this.businessProfileRepository = businessProfileRepository;
        }

        public List<SelectModel> CompanySelectItems()
        {            
            List<SelectModel> objlist = companyRepository.GetAll().Select(x => new SelectModel { Id = x.Id, Name = x.CompanyName }).ToList();
            return objlist;
        }

        public async Task<List<SelectModel>> GetCompanySelectItemsAsync()
        {
            return await Task.Run( ()=> companyRepository.Where(x=>x.IsActive == true).Select(x => new SelectModel { Id = x.Id, Name = x.CompanyName }).ToList());
        }

        public async Task<List<SelectModel>> GetCompanySelectItemsByBusinessProfileIdAsync(List<long> businessProfileIds)
        {
            return await Task.Run(() => companyRepository
            .Where(x => x.IsActive == true)
            .Select(x => new SelectModel {
                Id = x.Id,
                Name = x.CompanyName
            }).ToList());
        }

        public async Task<List<SelectModel>> GetCompanySelectItemsByBusinessProfileIdAsync(long businessProfileId)
        {
            return await Task.Run(() => companyRepository
            .Where(x => x.IsActive == true)
            .Select(x => new SelectModel
            {
                Id = x.Id,
                Name = x.CompanyName
            }).ToList());
        }

        public async Task<LoadResult> GetCompaniesAsync(DataSourceLoadOptionsBase options)
        {

            //var val = LoggedInUser.FullName;
            //IEnumerable value = companyDtoRepository.GetDevExpressStoredProcedure(options, "[Customer].[GetCompany]").data;
            //var val = await companyRepository.GetDevExpressListAsync(options);
            //Guid businessProfile = Guid.Parse("03E2DF64-A9DB-8B6B-CAF9-B7D7D92D145A");
            //return companyDtoRepository.GetDevExpressStoredProcedure(options, "EXECUTE [Customer].[GetCompany] @BusinessProfileId", businessProfile);

            options.Select = new[] { "Id", "CompanyName", "MainPhone", "MobilePhone", "Email", "Website", "IsActive" };
            return await companyRepository.GetDevExpressListAsync(options);
        }

        public async Task<CompanyModel> GetCompanyAsync(long id)
        {
             if (id == 0)
            {
                return new CompanyModel();
            }

            Company company = await companyRepository.Where(x => x.Id == id).FirstOrDefaultAsync();
           

            if (company == null)
            {
                throw new ItmNotFoundException("Region not found");
            }

            CompanyModel companyModel = Mapper.Map<CompanyModel>(company);

            return companyModel;
        }

        public async Task<long> ModifyCompanyAsync(long id, CompanyModel companyModel)
        {
            if (companyModel == null)
            {
                throw new ItmArgumentMissingException("Invalid Region data");
            }

            Company company = new Company();          

            if (companyModel.Id > 0)
            {
                
                    company = await companyRepository.Where(x => x.Id == id).FirstOrDefaultAsync();
         

                if (company == null)
                {
                    throw new ItmNotFoundException("Region not found for edit");
                }
            }

            Mapper.Map(companyModel, company);
            company.LogoId = null;
            company.BusinessProfileId = LoggedInUser.BusinessProfileId;
          
            if (id > 0)
            {
                return companyRepository.UpdateAsync(company).Result.Id;
            }
            else
            {
                company.CreatedByContactId = LoggedInUser.ContectId;
                company.CreatedDateTime = DateTime.Now;
            }

            return companyRepository.CreateAsync(company).Result.Id;

        }

        public async Task<long> DeleteCompanyAsync(long id)
        {
            Company company = await companyRepository.FindOneAsync(x => x.Id == id);

            if (company == null)
            {
                throw new ItmNotFoundException("Region not found");
            }

            return await companyRepository.DeleteAsync(company);
        }
        
        public async Task<bool> DeleteCompaniesAsync(List<long> ids)
        {
            if (ids == null)
            {
                throw new ItmArgumentMissingException("Region not found");
            }

            if (!await companyRepository.ExistsAsync(x => ids.Contains(x.Id)))
            {
                throw new ItmArgumentMissingException("Region not found");
            }

            return await companyRepository.DeleteAsync(t => ids.Contains(t.Id)) > 0;                
        }
       
        public async Task<LoadResult> GetCompaniesByBusinessProfileIdAsync(long id, DataSourceLoadOptionsBase options)
        {
            options.Select = new[] { "Id", "CompanyName" };
            return await this.companyRepository.GetDevExpressListAsync(options, t=>t.BusinessProfileId == id && t.IsActive == true);
        }

        /// <summary>
        /// Get entity detail tab list
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<TabModel> GetEntityDetailsTabs(long id)
        {
            List<TabModel> tabModels = new List<TabModel>
            {
                new TabModel(1, "General Information", "generalInformation")
            };

            if (id == 0)
            {
                return tabModels;
            }

            tabModels.Add(new TabModel(2, "Contact", "contact"));
            tabModels.Add(new TabModel(3, "Addresses", "addresses"));
            tabModels.Add(new TabModel(4, "Documents", "documents"));
            tabModels.Add(new TabModel(5, "Communications ", "communications"));

            //tabModels.Add(new TabModel(3, "Documents", "documents"));
            //tabModels.Add(new TabModel(4, "Communications", "communications"));
            //tabModels.Add(new TabModel(5, "Compliances", "compliances"));

            return tabModels;
        }

    }
}
