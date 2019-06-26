using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using LoanManager.ApplicationService.Models;
using LoanManager.Data;
using LoanManager.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LoanManager.Configuration;
using AutoMapper;
using Microsoft.Extensions.Logging;
using LoanManager.Shared;
using System.Net.Mail;

namespace LoanManager.ApplicationService
{
    public class EmployeeService : BaseService, IEmployeeService
    {
        private readonly IRepository<Employee> employeeRepository;
        private readonly IRepository<Contact> contactRepository;
        private readonly IRepository<Photo> photoRepository;
        private readonly IPhotoService photoService;
        private readonly IStoredProcedureRepository storedProcedureService;
        private readonly IRepository<EmailTemplate> emailTemplateRepository;
        private readonly IRepository<EmailHistory> emailHistoryRepository;

        public EmployeeService(ILogger<EmployeeService> logger,
            IMapper mapper,
            ILoggedInUserService loggedInUserService,
            IRepository<Employee> employeeRepository,
            IRepository<Contact> contactRepository,
            IRepository<Photo> photoRepository,
            IStoredProcedureRepository procedureService,
            IPhotoService photoService,
            IRepository<EmailTemplate> templateRepository,
            IRepository<EmailHistory> historyRepository) : base(logger, mapper, loggedInUserService)
        {
            this.employeeRepository = employeeRepository;         
            this.contactRepository = contactRepository;          
            this.photoRepository = photoRepository;
            this.storedProcedureService = procedureService;
            this.photoService = photoService;
            this.emailTemplateRepository = templateRepository;
            this.emailHistoryRepository = historyRepository;
        }

        public async Task<LoadResult> GetEmployeeListAsync(DataSourceLoadOptionsBase options)
        {
            var query = from e in this.employeeRepository.GetAll()
                        join c in this.contactRepository.GetAll().Include(t=>t.Postion) on e.ContactId equals c.Id
                        where c.ContactType == (int)LoanManager.Configuration.Enums.ContactType.Employee
                        select new
                        {
                            e.Id,
                            e.EmployeeId,
                            Name = c.FirstName + " " + c.LastName,
                            Position = c.Postion.Name,
                            Gender = c.Gender != null ? c.Gender.Name : "",
                            BusinessPhone = c.BusinessPhone,
                            HomePhone = c.HomePhone,
                            Mobile = c.Mobile,
                            Email = c.Email,
                            Fax = c.Fax,
                            Active = c.IsActive                           
                        };


            return await Task.Run(() => DataSourceLoader.Load(query, options));
        }

        /// <summary>
        /// Get entity detail tab list
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<TabModel> GetEmployeeDetailsTabs(long id)
        {
            List<TabModel> tabModels = new List<TabModel>
            {
                new TabModel(1, "General Information", "generalInformation")
            };

            if (id == 0)
            {
                return tabModels;
            }

            //tabModels.Add(new TabModel(2, "Address", "addresses"));

            //TODO
            //tabModels.Add(new TabModel(3, "Documents", "documents"));
            //tabModels.Add(new TabModel(4, "Communications", "communications"));
            //tabModels.Add(new TabModel(5, "Compliances", "compliances"));

            return tabModels;
        }

        public async Task<EmployeeModel> GetEmployeeByIdAsync(long id)
        {
            if (id == 0)
            {
                EmployeeModel empObj = new EmployeeModel();
                empObj.Contact.IsActive = true;
                return empObj;
            }         


            Employee employee = await employeeRepository.Where(x => x.Id == id)
                .Include(x => x.Contact)
                .ThenInclude(x => x.Photo)
                .FirstOrDefaultAsync();


            if (employee == null)
            {
                throw new ItmNotFoundException("Employee not found");
            }

            if (employee.Contact.Photo == null) employee.Contact.Photo = new Photo();
            var model = Mapper.Map<EmployeeModel>(employee);
            if (model != null)
            {
                model.IsActive = model.Contact.IsActive;  
            }

            return model;
        }

        public async Task<long> SaveEmployeeAsync(long id, EmployeeModel model)
        {
            if (model == null)
            {
                throw new ItmArgumentMissingException("Invalid Data");
            }
            else
            {
                if (employeeRepository.Where(x => x.EmployeeId == model.EmployeeId && x.Id != id)                   
                    .Any())
                {
                    throw new ItmInvalidDataException("Employee Id cannot be duplicated.");
                }

                var result = this.ValidateUserEmail(model.Contact.Id, model.Contact.Email);
                if (!result)
                    throw new ItmInvalidDataException("Email cannot be duplicated.");
            }

            Employee employee = new Employee();


            if (!model.Contact.Photo.IsUpdated && !model.Contact.Photo.IsDeleted)
            {
                model.Contact.Photo = null;
            }

            if (model.Contact.Id > 0)
            {
                if (model.Contact.Photo != null)
                {


                    employee = await employeeRepository.Where(x => x.Id == id)
                    .Include(x => x.Contact).ThenInclude(x => x.Photo)                   
                    .FirstOrDefaultAsync();

                }
                else
                {
                    employee = await employeeRepository.Where(x => x.Id == id)                   
                     .Include(x => x.Contact)
                     .FirstOrDefaultAsync();

                }

                if (employee == null)
                {
                    throw new ItmNotFoundException("Employee not found");
                }
            }

            if (employee != null)
            {
                model.IsActive = model.Contact.IsActive;
                this.Mapper.Map(model, employee);               
                employee.Contact.ContactType = (int)LoanManager.Configuration.Enums.ContactType.Employee;      
                
                if(employee.Contact.PostingZoneId == ZoneType.RegionalOffice)
                {
                    employee.Contact.BranchId = null;
                    employee.Contact.BusinessProfileId = null;
                }
                else if (employee.Contact.PostingZoneId == ZoneType.BranchOffice)
                {
                    employee.Contact.CompanyId = null;
                    employee.Contact.BusinessProfileId = null;
                }
                else
                {
                    employee.Contact.CompanyId = null;
                    employee.Contact.BranchId = null;
                    employee.Contact.BusinessProfileId = LoggedInUser.BusinessProfileId;

                }


                if (model.Contact.PhotoId > 0 && model.Contact.Photo != null)
                {
                    if (model.Contact.Photo.IsDeleted)
                    {
                        employee.Contact.PhotoId = null;
                        employee.Contact.Photo = null;
                    }
                    else
                    {
                        employee.Contact.Photo.OrginalFileName = model.Contact.Photo.UploadedFileName;
                        employee.Contact.Photo.PhotoThumb = this.photoService.GetImageFile(model.Contact.Photo.UploadedFileName);
                    }
                }
                else if (!string.IsNullOrEmpty(model.Contact.Photo?.UploadedFileName))
                {
                    Photo photo = new Photo();
                    photo.PhotoThumb = this.photoService.GetImageFile(model.Contact.Photo.UploadedFileName);
                    photo.FileName = model.Contact.DisplayName;
                    photo.OrginalFileName = model.Contact.Photo.UploadedFileName;
                    photo.IsDefault = true;
                    photo.IsVisibleInPublicPortal = true;                  
                    employee.Contact.Photo = photo;
                }  
                

                if (model.Id == 0)
                {
                    await employeeRepository.CreateAsync(employee);
                }
                else
                {
                    await employeeRepository.UpdateAsync(employee);
                    //Delete Photo
                    if (model.Contact.Photo != null && model.Contact.Photo.IsDeleted)
                    {
                        photoRepository.Delete(p => p.Id == model.Contact.Photo.Id);
                    }
                }
            }

            ////Step 1: Prepare Email from Email Template EmailHistory
            //var emailTemplate = emailTemplateRepository.Where(e => e.TemplateType == (int)LoanManager.Configuration.Enums.EnumEmailTemplateType.Employee).FirstOrDefault();
            //if (emailTemplate != null && !string.IsNullOrEmpty(emailTemplate.TemplateSubject) && !string.IsNullOrEmpty(emailTemplate.TemplateDetail))
            //{
            //    var emailManager = new EmailManager();

            //    //Prepare MailMessage
            //    MailMessage message = new MailMessage();
            //    MailAddress resp = new MailAddress("ak.azad@live.com");
            //    message.To.Add(resp);

            //    message.Subject = emailTemplate.TemplateSubject;
            //    message.Priority = MailPriority.Normal;

            //    emailTemplate.TemplateDetail = emailTemplate.TemplateDetail.Replace(emailManager.PrepreTag("userName"), "Mr. ABC");
            //    emailTemplate.TemplateDetail = emailTemplate.TemplateDetail.Replace(emailManager.PrepreTag("loanApplicationID"), "LA - 1234");

            //    message.Body = emailTemplate.TemplateDetail;
            //    message.IsBodyHtml = true;
            //    message.BodyEncoding = System.Text.Encoding.GetEncoding("utf-8");

            //    //Step 2: Send Email                
            //    if (emailManager.SendEmail(message))
            //    {
            //        //Step 3: Save Email History
            //        EmailHistory obj = new EmailHistory();
            //        obj.EntityTypeId = LoanManager.Configuration.ApplicationEntityType.Employee;
            //        obj.EntityId = employee.Id;
            //        obj.EmailSender = emailManager.SenderEmailAddress;
            //        obj.EmailReceiver = "ak.azad@live.com";
            //        obj.Subject = message.Subject;
            //        obj.EmailContent = message.Body;
            //        obj.CreatedByContactId = LoggedInUser.ContectId;
            //        obj.DateCreated = DateTime.UtcNow;

            //        this.emailHistoryRepository.Create(obj);
            //    }
            //}

            return employee.Id;
        }

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

        public async Task<bool> DeleteEmployeeAsync(long id)
        {
            if (id < 1 || !await employeeRepository.ExistsAsync(x => x.Id == id))
            {
                throw new ItmArgumentMissingException("Employee not found");
            }

            var validationSummary = storedProcedureService.GetValidationSummary(DeletableEntityType.Employee, id);
            if (validationSummary != null && !validationSummary.IsValid)
            {
                throw new ItmArgumentMissingException(validationSummary.ValidationMessage);
            }

            long? contactId = employeeRepository.FindOne(x => x.Id == id).ContactId;
            long? photoid = contactRepository.FindOne(x => x.Id == contactId).PhotoId;

            //delete employee data
            this.employeeRepository.Remove(this.employeeRepository.Where(t => t.Id == id).ToList());
            //delete contact data
            await contactRepository.DeleteAsync(t => t.Id == contactId);

            //Delete Photo
            if (photoid != null && photoid > 0)
            {
                photoRepository.Delete(p => p.Id == photoid);
            }

            return true;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public async Task<bool> DeleteEmployeesAsync(List<long> ids)
        {
            throw new NotImplementedException();
        }
    }
}
