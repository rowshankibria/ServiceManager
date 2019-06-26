using AutoMapper;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using LoanManager.ApplicationService.Models;
using LoanManager.Configuration;
using LoanManager.Configuration.Enums;
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
    public class ContactService : BaseService, IContactService
    {
        private readonly IRepository<Contact> contactRepository;
        private readonly IRepository<Employee> employeeRepository;
        private readonly IRepository<SystemUser> userRepository;
        private readonly IRepository<BusinessProfile> businessProfileRepository;
        private readonly IRepository<Company> companyRepository;
        private readonly IHostingEnvironment hostingEnvironment;
        private readonly IRepository<Photo> photoRepository;
        private readonly IPhotoService photoService;

        /// <summary>
        /// constructor
        /// </summary>
        /// <param name="contactRepository"></param>
        /// <param name="logger"></param>
        /// <param name="mapper"></param>
        /// <param name="loggedInUserService"></param>
        public ContactService(ILogger<ContactService> logger,
            IMapper mapper,
            IRepository<Employee> employeeRepository,
            IRepository<Company> companyRepository,
            IRepository<Contact> contactRepository,
            IRepository<Photo> photoRepository,
            IPhotoService photoService,
            IHostingEnvironment hostingEnvironment,
             ILoggedInUserService loggedInUserService,
             IRepository<SystemUser> userRepository,
            IRepository<BusinessProfile> businessProfileRepository) : base(logger, mapper, loggedInUserService)
        {

            this.userRepository = userRepository;
            this.businessProfileRepository = businessProfileRepository;           
            this.companyRepository = companyRepository;
            this.contactRepository = contactRepository;
            this.hostingEnvironment = hostingEnvironment;
            this.photoService = photoService;
            this.photoRepository = photoRepository;
            this.employeeRepository = employeeRepository;
        }

        #region Get Methods


        /// <summary>
        /// Get contacts by company
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public async Task<IQueryable> GetContacts()
        {
            
            var query = from c in this.contactRepository.GetAll().Include(t => t.Gender).Include(t => t.PreferredContactMethod).Include(t=>t.Company)
                        select new
                        {
                            c.Id,
                            Name = c.FirstName + " " + c.LastName,                           
                            CompanyName = c.Company != null ? c.Company.CompanyName : "",
                            Gender = c.Gender != null ? c.Gender.Name : "",
                            BusinessPhone = c.BusinessPhone,
                            HomePhone = c.HomePhone,
                            Mobile = c.Mobile,
                            Email = c.Email,
                            Fax = c.Fax,
                            Active = c.IsActive,
                            PreferredContactMethod = c.PreferredContactMethod != null ? c.PreferredContactMethod.Name : "",                           
                        };


            return await Task.Run(() => query.AsQueryable());
        }

        /// <summary>
        /// Get contacts by company
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public async Task<LoadResult> GetDevexContacts(DataSourceLoadOptionsBase options)
        {
            var query = from c in this.contactRepository.GetAll().Include(t => t.Gender)
                        .Where(p => p.FirstName != null && p.FirstName != "" 
                                    && p.ContactType == (int)ContactType.Client)
                        select new                        
                        {
                            c.Id,
                            Name = c.FirstName + " " + c.LastName,
                            Gender = c.Gender != null ? c.Gender.Name : "",
                            BusinessPhone = c.BusinessPhone,
                            Mobile = c.Mobile,
                            Email = c.Email,
                            Active = c.IsActive,
                        };


            return await Task.Run(() => DataSourceLoader.Load(query, options));
        }

        /// <summary>
        /// Get Entity by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<ContactModel> GetEntityAsync(long id)
        {
            if (id == 0)
            {
                var objContact = new ContactModel();
                objContact.IsActive = true;
                return objContact;
            }

            Contact contact = await contactRepository.Where(x => x.Id == id).Include(x => x.Photo).FirstOrDefaultAsync();

            if (contact == null)
            {
                throw new ItmNotFoundException("Contact not found");
            }

            if (contact.Photo == null) contact.Photo = new Photo();
            var obj = Mapper.Map<ContactModel>(contact);           

            return obj;
        }       
        /// <summary>
        /// get entity for user
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<ContactModel> GetEntityForUserAddAsync(long id)
        {
            if (id == 0)
            {
                return new ContactModel();
            }

            Contact contact = await contactRepository.Where(x => x.Id == id).Include(x => x.Photo).FirstOrDefaultAsync();
            if (contact == null)
            {
                throw new ItmNotFoundException("Contact not found");
            }

            if (contact.Photo == null) contact.Photo = new Photo();
            var obj = Mapper.Map<ContactModel>(contact);           

            return obj;

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

            tabModels.Add(new TabModel(2, "Address", "addresses"));

            //TODO
            //tabModels.Add(new TabModel(3, "Documents", "documents"));
            //tabModels.Add(new TabModel(4, "Communications", "communications"));
            //tabModels.Add(new TabModel(5, "Compliances", "compliances"));

            return tabModels;
        }

        #endregion

        #region Insert/Update/Delete Methods

        /// <summary>
        /// Insert/update entity
        /// </summary>
        /// <param name="contactModel"></param>
        /// <returns></returns>
        public async Task<long> SaveEntityAsync(ContactModel contactModel)
        {
            if (contactModel == null)
            {
                throw new ItmArgumentMissingException("Contact not found");
            }
            else
            {
                var result = this.ValidateUserEmail(contactModel.Id, contactModel.Email);
                if (!result)
                    throw new ItmInvalidDataException("Email cannot be duplicated.");
            }

            Contact contact = new Contact();

            if (!contactModel.Photo.IsUpdated && !contactModel.Photo.IsDeleted)
            {
                contactModel.Photo = null;
            }

            if (contactModel.Id > 0)
            {
                if (contactModel.Photo != null)
                {
                    contact = contactRepository.Where(b => b.Id == contactModel.Id).Include(p => p.Photo).FirstOrDefault();
                }
                else
                {
                    contact = contactRepository.Where(b => b.Id == contactModel.Id).FirstOrDefault();
                }

                if (contact == null)
                {
                    throw new ItmNotFoundException("Contact not found");
                }
            }


            if (contact != null)
            {
                Mapper.Map(contactModel, contact);

                if (contactModel.PhotoId > 0 && contactModel.Photo != null)
                {
                    if (contactModel.Photo.IsDeleted)
                    {
                        contact.PhotoId = null;
                        contact.Photo = null;
                    }
                    else
                    {
                        contact.Photo.OrginalFileName = contactModel.Photo.UploadedFileName;
                        contact.Photo.PhotoThumb = this.photoService.GetImageFile(contactModel.Photo.UploadedFileName);
                    }
                }
                else if (!string.IsNullOrEmpty(contactModel.Photo?.UploadedFileName))
                {
                    Photo photo = new Photo();
                    photo.PhotoThumb = this.photoService.GetImageFile(contactModel.Photo.UploadedFileName);
                    photo.FileName = contactModel.DisplayName;
                    photo.OrginalFileName = contactModel.Photo.UploadedFileName;
                    photo.IsDefault = true;
                    photo.IsVisibleInPublicPortal = true;                   
                    contact.Photo = photo;
                }
                               
                if (contactModel.Id == 0)
                {
                    contact.ContactType = (int)ContactType.Client;
                    await contactRepository.CreateAsync(contact);
                }
                else
                {
                    await contactRepository.UpdateAsync(contact);
                    //Delete Photo
                    if (contactModel.Photo != null && contactModel.Photo.IsDeleted)
                    {
                        photoRepository.Delete(p => p.Id == contactModel.Photo.Id);
                    }
                }

            }
            return contact.Id;
        }
        /// <summary>
        /// Delete entities by id list
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public async Task<bool> DeleteEntityAsync(long id)
        {
            if (id < 1)
            {
                throw new ItmArgumentMissingException("Client not found");
            }

            if (!await contactRepository.ExistsAsync(x => x.Id == id))
            {
                throw new ItmArgumentMissingException("Client not found");
            }           

            return await contactRepository.DeleteAsync(t => t.Id == id) > 0;
        }

        /// <summary>
        /// Delete entities by id list
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public async Task<bool> DeleteEntitiesAsync(List<long> ids)
        {
            if (ids == null)
            {
                throw new ItmArgumentMissingException("Contact not found");
            }
            foreach (long id in ids)
            {
                if (!await contactRepository.ExistsAsync(x => ids.Contains(x.Id)))
                {
                    throw new ItmArgumentMissingException("Contact not found");
                }

                await contactRepository.DeleteAsync(t => t.Id == id);
            }
            return true;
        }

        #endregion

        #region Validations Methods

        /// <summary>
        /// check whether this email is used to another user or not
        /// </summary>
        /// <param name="id"></param>
        /// <param name="email"></param>
        /// <returns></returns>
        public bool ValidateUserEmail(long id, string email)
        {
            bool isValidEmail = true;

            //if it is not empty
            if (id > 0)
            {
                Contact obj = this.contactRepository.Where(t => t.Id != id && t.Email == email).FirstOrDefault();
                if (obj != null)
                {
                    isValidEmail = false;
                }
            }
            else
            {
                Contact obj = this.contactRepository.Where(t => t.Email == email).FirstOrDefault();
                if (obj != null)
                {
                    isValidEmail = false;
                }
            }

            return isValidEmail;
        }

        #endregion

        #region Get Methods For Controls [Combobox, Listbox, etc]

        /// <summary>
        /// get preferred phone type
        /// </summary>
        /// <returns></returns>
        public List<SelectModel> GetPreferredPhoneTypeSelectedItem()
        {
            return LoanManager.Utilities.GetEnumValueList(typeof(LoanManager.Configuration.Enums.PreferredPhoneType));
        }
        /// <summary>
        /// Contacts for selection controls
        /// </summary>
        /// <returns></returns>
        public List<SelectModel> ContactSelectItems()
        {
            return contactRepository.Where(x => x.IsActive).Select(x => new SelectModel { Id = x.Id, Name = x.FirstName }).ToList();
        }
        /// <summary>
        /// get gender type
        /// </summary>
        /// <returns></returns>
        public List<SelectModel> GetGenderTypeSelectedItem()
        {
            return LoanManager.Utilities.GetEnumValueList(typeof(LoanManager.Configuration.Enums.GenderType));
        }



        #endregion

        /// <summary>
        /// 
        /// </summary>      
        /// <returns></returns>
        public List<SelectModel> GetEmployeeSelectItemsAsync()
        {
            List<long> listContact = this.userRepository.GetAll().Select(t => t.ContactId).ToList();

            var query = from e in this.employeeRepository.GetAll()
                        join c in this.contactRepository.GetAll() on e.ContactId equals c.Id
                        where c.IsActive == true && c.ContactType == (int)ContactType.Employee
                        && !listContact.Contains(c.Id)
                        select new SelectModel
                        {
                            Id = c.Id,
                            Name = c.FirstName + " " + c.LastName + " (email: " + c.Email + ")"
                        };


            return query.Distinct().ToList<SelectModel>();
        }

        /// <summary>
        /// 
        /// </summary>      
        /// <returns></returns>
        public List<SelectModel> GetContactSelectItemsAsync()
        {
            List<long> listContact = this.userRepository.GetAll().Select(t => t.ContactId).ToList();

            var query = from c in this.contactRepository.GetAll()
                        where c.IsActive == true && c.ContactType == (int)LoanManager.Configuration.Enums.ContactType.Client
                        && !listContact.Contains(c.Id)
                        select new SelectModel
                        {
                            Id = c.Id,
                            Name = c.FirstName + " " + c.LastName + " (email: " + c.Email + ")"
                        };


            return query.Distinct().ToList<SelectModel>();
        }
    }
}
