using AutoMapper;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using LoanManager.ApplicationService;
using LoanManager.ApplicationService.Models;
using LoanManager.Configuration;
using LoanManager.Data;
using LoanManager.Data.Models;
using LoanManager.Data.StoredProcedureModel;
using LoanManager.Shared;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
    public class LoanApplicationService : BaseService, ILoanApplicationService
    {
        private readonly IRepository<LoanApplication> loanApplicationManager;
        private readonly IRepository<ApprovalEntityMapping> loanApplicationApprovalMappingManager;
        private readonly IRepository<ApprovalEntityMappingChecklist> loanApplicationApprovalMappingChecklistManager;
        private readonly IRepository<ApproverGroup> approverGroupMappingManager;
        private readonly IRepository<ApproverGroupMember> approverGroupMemberMappingManager;
        private readonly IRepository<ApplicationCustomField> applicationCustomFieldManager;
        private readonly IRepository<ApprovalProcessStep> approvalProcessStepRepository;
        private readonly IRepository<ApprovalProcessStepChecklist> approvalProcessStepChecklistRepository;
        private readonly IRepository<Contact> contactManager;
        private readonly IRepository<Employee> employeeManager;
        private readonly IRepository<Photo> photoRepository;
        private readonly IRepository<LoanType> loanTypeRepository;
        private readonly IRepository<CustomFieldMaster> customFieldMasterRepository;
        private readonly IRepository<CustomCategory> customCategoryRepository;
        private readonly IRepository<ApprovalProcess> approvalProcessRepository;
        private readonly IRepository<Note> noteRepository;
        private readonly IRepository<Document> documentManager;
        private readonly IRepository<EmailTemplate> emailTemplateRepository;
        private readonly IRepository<EmailHistory> emailHistoryRepository;
        private readonly IRepository<LoanDocumentType> loanDocumentRepository;
        private readonly IPhotoService photoService;
        private readonly IHostingEnvironment hostingEnvironment;
        private readonly IMapper mapper;
        private readonly IStoredProcedureRepository storedProcedure;
        private readonly IRepository<BusinessCategory> businessCategoryRepository;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="loggedInUserService"></param>
        /// <param name="hostingEnvironment"></param>
        /// <param name="mapper"></param>
        public LoanApplicationService(ILogger<LoanApplicationService> logger,
            IRepository<LoanApplication> loanApplicationManager,
            ILoggedInUserService loggedInUserService,
            IHostingEnvironment hostingEnvironment,
            IRepository<ApprovalProcessStep> approvalProcessStepRepository,
            IRepository<ApprovalProcessStepChecklist> approvalProcessStepChecklistRepository,
            IMapper mapper,
            IRepository<Employee> employeeManager,
            IRepository<EmailTemplate> emailTemplateRepository,
            IRepository<EmailHistory> emailHistoryRepository,
            IRepository<Photo> photoRepository,
            IRepository<Contact> contactManager,
            IPhotoService photoService,
            IRepository<ApplicationCustomField> applicationCustomFieldManager,
            IRepository<LoanType> loanTypeRepository,
            IRepository<CustomFieldMaster> customFieldMasterRepository,
            IRepository<CustomCategory> customCategoryRepository,
            IRepository<ApprovalEntityMapping> loanApplicationApprovalMappingManager,
            IRepository<ApproverGroup> approverGroupMappingManager,
            IRepository<ApprovalProcess> approvalProcessRepository,
            IRepository<ApprovalEntityMappingChecklist> loanApplicationApprovalMappingChecklistManager,
            IRepository<Note> noteRepository,
            IRepository<Document> documentManager,
            IRepository<ApproverGroupMember> approverGroupMemberMappingManager,
            IStoredProcedureRepository storedProcedure,
            IRepository<BusinessCategory> businessCategoryRepository,
            IRepository<LoanDocumentType> loanDocumentRepository
            ) : base(logger, mapper, loggedInUserService)
        {
            this.loanApplicationApprovalMappingChecklistManager = loanApplicationApprovalMappingChecklistManager;
            this.hostingEnvironment = hostingEnvironment;
            this.mapper = mapper;
            this.loanApplicationManager = loanApplicationManager;
            this.contactManager = contactManager;
            this.photoService = photoService;
            this.photoRepository = photoRepository;
            this.applicationCustomFieldManager = applicationCustomFieldManager;
            this.loanTypeRepository = loanTypeRepository;
            this.customFieldMasterRepository = customFieldMasterRepository;
            this.customCategoryRepository = customCategoryRepository;
            this.approvalProcessStepRepository = approvalProcessStepRepository;
            this.approvalProcessStepChecklistRepository = approvalProcessStepChecklistRepository;
            this.employeeManager = employeeManager;
            this.loanApplicationApprovalMappingManager = loanApplicationApprovalMappingManager;
            this.approverGroupMappingManager = approverGroupMappingManager;
            this.approvalProcessRepository = approvalProcessRepository;
            this.storedProcedure = storedProcedure;
            this.noteRepository = noteRepository;
            this.documentManager = documentManager;
            this.approverGroupMemberMappingManager = approverGroupMemberMappingManager;
            this.emailTemplateRepository = emailTemplateRepository;
            this.emailHistoryRepository = emailHistoryRepository;
            this.businessCategoryRepository = businessCategoryRepository;
            this.loanDocumentRepository = loanDocumentRepository;
        }


        #region List Methods

        public async Task<IQueryable> GetActiveLoanApplicationsAsync(long contactId)
        {



            contactId = LoggedInUser.ContectId;
            var query = from c in this.loanApplicationManager.GetAll()
                        .Include(t => t.Contact)
                        .Include(t => t.ApplicationStatus)
                        .Include(t => t.LoanType)
                        .Include(t => t.Branch)
                        .Where(t => t.ContactId == contactId)
                        select new
                        {
                            c.Id,
                            c.ApplicationId,
                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                            BusinessPhone = c.Contact.BusinessPhone,
                            HomePhone = c.Contact.HomePhone,
                            Mobile = c.Contact.Mobile,
                            Email = c.Contact.Email,
                            LoanType = c.LoanType.Name,
                            Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                            ApplicationDate = c.ApplicationDate,
                            LoanAmount = c.RequestedLoanAmount,
                            Status = c.ApplicationStatus.Name
                        };

            return await Task.Run(() => query.AsQueryable());
        }
        /// <summary>
        /// Get contacts by company
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public async Task<LoadResult> GetDevexActiveLoanApplicationsAsync(DataSourceLoadOptionsBase options)
        {
            long loggedInUserContactId = LoggedInUser.ContectId;
            long postingZoneId = 0;
            long positionMapTypeId = 0;
            long branchId = 0;

            var objEmployee = this.employeeManager.Where(t => t.ContactId == loggedInUserContactId).FirstOrDefault();

            if (objEmployee != null)
            {
                Contact contactObj = await this.contactManager.Where(t => t.Id == loggedInUserContactId)
                                                              .Include(t => t.Postion)
                                                              .Include(t => t.PostingZone)
                                                              .Include(t => t.Branch)
                                                              .FirstOrDefaultAsync();

                if (contactObj != null)
                {
                    postingZoneId = contactObj.PostingZoneId.Value;
                    positionMapTypeId = contactObj.Postion.CustomCategoryMapTypeOptionId.HasValue ? contactObj.Postion.CustomCategoryMapTypeOptionId.Value : 0;
                    branchId = contactObj.BranchId.HasValue ? contactObj.BranchId.Value : 0;

                    //if position mapType == 
                    if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.CreditOfficer)
                    {
                        #region Credit Officer


                        var queryLoan = from c in this.loanApplicationManager.GetAll()
                                                       .Include(t => t.Contact)
                                                       .Include(t => t.ApplicationStatus)
                                                       .Include(t => t.LoanType)
                                                       .Include(t => t.Branch)
                                        join customCat in this.customCategoryRepository.GetAll() on c.ApplicationStatusId equals customCat.Id
                                        where
                                        (customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.NotStarted
                                        || customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.InProgress
                                        || customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.Approved
                                        || customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.Rejected)
                                        &&
                                        (branchId > 0 ? c.BranchId == branchId : c.BranchId == c.BranchId)


                                        select new
                                        {
                                            c.Id,
                                            c.ApplicationId,
                                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                                            BusinessPhone = c.Contact.BusinessPhone,
                                            HomePhone = c.Contact.HomePhone,
                                            Mobile = c.Contact.Mobile,
                                            Email = c.Contact.Email,
                                            LoanType = c.LoanType.Name,
                                            Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                                            ApplicationDate = c.ApplicationDate,
                                            LoanAmount = c.RequestedLoanAmount,
                                            Status = c.ApplicationStatus.Name
                                        };


                        return await Task.Run(() => DataSourceLoader.Load(queryLoan, options));

                        #endregion
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.BranchManager)
                    {
                        #region Branch Manager

                        var queryLoan = from c in this.loanApplicationManager.GetAll()
                                                       .Include(t => t.Contact)
                                                       .Include(t => t.ApplicationStatus)
                                                       .Include(t => t.LoanType)
                                                       .Include(t => t.Branch)
                                                       .Include(t => t.ApprovalEntityMappings)
                                        join customCat in this.customCategoryRepository.GetAll() on c.ApplicationStatusId equals customCat.Id
                                        join appMap in this.loanApplicationApprovalMappingManager.GetAll() on c.Id equals appMap.ApplicationId
                                        //join appProc in this.approvalProcessRepository.GetAll() on appMap.ApprovalProcessId equals appProc.Id
                                        join appProcStep in this.approvalProcessStepRepository.GetAll() on appMap.ApprovalProcessStepId equals appProcStep.Id
                                        join appGrp in this.approverGroupMappingManager.GetAll() on appProcStep.ApproverGroupId equals appGrp.Id
                                        join appGrpMem in this.approverGroupMemberMappingManager.GetAll() on appGrp.Id equals appGrpMem.ApprovalGroupId

                                        where
                                        (customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.InProgress)
                                        &&
                                        (branchId > 0 ? c.BranchId == branchId : c.BranchId == c.BranchId)
                                        &&
                                        appGrp.ApproverGroupTypeId == LoanManager.Configuration.ApproverGroupType.BranchManager
                                        &&
                                        appMap.StatusId == LoanManager.Configuration.ApprovalStatus.InProgress
                                        &&
                                        appGrpMem.EmployeeId == objEmployee.Id

                                        select new
                                        {
                                            c.Id,
                                            c.ApplicationId,
                                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                                            BusinessPhone = c.Contact.BusinessPhone,
                                            HomePhone = c.Contact.HomePhone,
                                            Mobile = c.Contact.Mobile,
                                            Email = c.Contact.Email,
                                            LoanType = c.LoanType.Name,
                                            Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                                            ApplicationDate = c.ApplicationDate,
                                            LoanAmount = c.RequestedLoanAmount,
                                            Status = c.ApplicationStatus.Name
                                        };


                        return await Task.Run(() => DataSourceLoader.Load(queryLoan.Distinct(), options));

                        #endregion
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.ClusterHead)
                    {
                        #region Cluster Head

                        var queryLoan = from c in this.loanApplicationManager.GetAll()
                                                       .Include(t => t.Contact)
                                                       .Include(t => t.ApplicationStatus)
                                                       .Include(t => t.LoanType)
                                                       .Include(t => t.Branch)
                                                       .Include(t => t.ApprovalEntityMappings)
                                        join customCat in this.customCategoryRepository.GetAll() on c.ApplicationStatusId equals customCat.Id
                                        join appMap in this.loanApplicationApprovalMappingManager.GetAll() on c.Id equals appMap.ApplicationId
                                        //join appProc in this.approvalProcessRepository.GetAll() on appMap.ApprovalProcessId equals appProc.Id
                                        join appProcStep in this.approvalProcessStepRepository.GetAll() on appMap.ApprovalProcessStepId equals appProcStep.Id
                                        join appGrp in this.approverGroupMappingManager.GetAll() on appProcStep.ApproverGroupId equals appGrp.Id
                                        join appGrpMem in this.approverGroupMemberMappingManager.GetAll() on appGrp.Id equals appGrpMem.ApprovalGroupId

                                        where
                                        (customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.InProgress)
                                        &&
                                        (branchId > 0 ? c.BranchId == branchId : c.BranchId == c.BranchId)
                                        &&
                                        appGrp.ApproverGroupTypeId == LoanManager.Configuration.ApproverGroupType.ClusterHead
                                        &&
                                        appMap.StatusId == LoanManager.Configuration.ApprovalStatus.InProgress
                                        //||
                                        //appMap.StatusId == LoanManager.Configuration.ApprovalStatus.Review
                                        //)
                                        &&
                                        appGrpMem.EmployeeId == objEmployee.Id

                                        select new
                                        {
                                            c.Id,
                                            c.ApplicationId,
                                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                                            BusinessPhone = c.Contact.BusinessPhone,
                                            HomePhone = c.Contact.HomePhone,
                                            Mobile = c.Contact.Mobile,
                                            Email = c.Contact.Email,
                                            LoanType = c.LoanType.Name,
                                            Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                                            ApplicationDate = c.ApplicationDate,
                                            LoanAmount = c.RequestedLoanAmount,
                                            Status = c.ApplicationStatus.Name
                                        };


                        return await Task.Run(() => DataSourceLoader.Load(queryLoan.Distinct(), options));

                        #endregion
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.CreditOperationHead)
                    {
                        #region Credit Operation

                        var queryLoan = from c in this.loanApplicationManager.GetAll()
                                                       .Include(t => t.Contact)
                                                       .Include(t => t.ApplicationStatus)
                                                       .Include(t => t.LoanType)
                                                       .Include(t => t.Branch)
                                                       .Include(t => t.ApprovalEntityMappings)
                                        join customCat in this.customCategoryRepository.GetAll() on c.ApplicationStatusId equals customCat.Id
                                        join appMap in this.loanApplicationApprovalMappingManager.GetAll() on c.Id equals appMap.ApplicationId
                                        join appProcStep in this.approvalProcessStepRepository.GetAll() on appMap.ApprovalProcessStepId equals appProcStep.Id
                                        join appProc in this.approvalProcessRepository.GetAll() on appProcStep.ApprovalProcessId equals appProc.Id
                                        join appGrp in this.approverGroupMappingManager.GetAll() on appProcStep.ApproverGroupId equals appGrp.Id
                                        join appGrpMem in this.approverGroupMemberMappingManager.GetAll() on appGrp.Id equals appGrpMem.ApprovalGroupId

                                        where
                                        (customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.InProgress)
                                        &&
                                        (branchId > 0 ? c.BranchId == branchId : c.BranchId == c.BranchId)
                                         &&
                                        appGrp.ApproverGroupTypeId == LoanManager.Configuration.ApproverGroupType.CreditOperation
                                        &&
                                        appMap.StatusId == LoanManager.Configuration.ApprovalStatus.InProgress
                                        //||
                                        //appMap.StatusId == LoanManager.Configuration.ApprovalStatus.Review
                                        //)
                                        &&
                                        appGrpMem.EmployeeId == objEmployee.Id

                                        select new
                                        {
                                            c.Id,
                                            c.ApplicationId,
                                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                                            BusinessPhone = c.Contact.BusinessPhone,
                                            HomePhone = c.Contact.HomePhone,
                                            Mobile = c.Contact.Mobile,
                                            Email = c.Contact.Email,
                                            LoanType = c.LoanType.Name,
                                            Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                                            ApplicationDate = c.ApplicationDate,
                                            LoanAmount = c.RequestedLoanAmount,
                                            Status = c.ApplicationStatus.Name
                                        };


                        return await Task.Run(() => DataSourceLoader.Load(queryLoan.Distinct(), options));

                        #endregion
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.RiskOfficer ||
                            positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.LegalOfficer ||
                            positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.ComplianceOfficer
                        )
                    {

                        #region Risk, Legal & Compliance Operation

                        var queryLoan = from c in this.loanApplicationManager.GetAll()
                                                       .Include(t => t.Contact)
                                                       .Include(t => t.ApplicationStatus)
                                                       .Include(t => t.LoanType)
                                                       .Include(t => t.Branch)
                                                       .Include(t => t.ApprovalEntityMappings)
                                        join customCat in this.customCategoryRepository.GetAll() on c.ApplicationStatusId equals customCat.Id
                                        join appMap in this.loanApplicationApprovalMappingManager.GetAll() on c.Id equals appMap.ApplicationId
                                        join appProcStep in this.approvalProcessStepRepository.GetAll() on appMap.ApprovalProcessStepId equals appProcStep.Id
                                        join appProc in this.approvalProcessRepository.GetAll() on appProcStep.ApprovalProcessId equals appProc.Id
                                        join appGrp in this.approverGroupMappingManager.GetAll() on appProcStep.ApproverGroupId equals appGrp.Id
                                        join appGrpMem in this.approverGroupMemberMappingManager.GetAll() on appGrp.Id equals appGrpMem.ApprovalGroupId

                                        where
                                        (customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.InProgress)
                                        &&
                                        (branchId > 0 ? c.BranchId == branchId : c.BranchId == c.BranchId)
                                         &&
                                        appGrp.ApproverGroupTypeId == LoanManager.Configuration.ApproverGroupType.Risk_LegalAndCompliance
                                        &&
                                        appMap.StatusId == LoanManager.Configuration.ApprovalStatus.InProgress
                                        //||
                                        //appMap.StatusId == LoanManager.Configuration.ApprovalStatus.Review
                                        //)
                                        &&
                                        appGrpMem.EmployeeId == objEmployee.Id

                                        select new
                                        {
                                            c.Id,
                                            c.ApplicationId,
                                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                                            BusinessPhone = c.Contact.BusinessPhone,
                                            HomePhone = c.Contact.HomePhone,
                                            Mobile = c.Contact.Mobile,
                                            Email = c.Contact.Email,
                                            LoanType = c.LoanType.Name,
                                            Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                                            ApplicationDate = c.ApplicationDate,
                                            LoanAmount = c.RequestedLoanAmount,
                                            Status = c.ApplicationStatus.Name
                                        };


                        return await Task.Run(() => DataSourceLoader.Load(queryLoan.Distinct(), options));

                        #endregion

                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.DCEO_DGMCEO)
                    {
                        #region Deputy CEO

                        var queryLoan = from c in this.loanApplicationManager.GetAll()
                                                       .Include(t => t.Contact)
                                                       .Include(t => t.ApplicationStatus)
                                                       .Include(t => t.LoanType)
                                                       .Include(t => t.Branch)
                                                       .Include(t => t.ApprovalEntityMappings)
                                        join customCat in this.customCategoryRepository.GetAll() on c.ApplicationStatusId equals customCat.Id
                                        join appMap in this.loanApplicationApprovalMappingManager.GetAll() on c.Id equals appMap.ApplicationId
                                        //join appProc in this.approvalProcessRepository.GetAll() on appMap.ApprovalProcessId equals appProc.Id
                                        join appProcStep in this.approvalProcessStepRepository.GetAll() on appMap.ApprovalProcessStepId equals appProcStep.Id
                                        join appGrp in this.approverGroupMappingManager.GetAll() on appProcStep.ApproverGroupId equals appGrp.Id
                                        join appGrpMem in this.approverGroupMemberMappingManager.GetAll() on appGrp.Id equals appGrpMem.ApprovalGroupId

                                        where
                                        (customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.InProgress)
                                        &&
                                        (branchId > 0 ? c.BranchId == branchId : c.BranchId == c.BranchId)
                                        &&
                                        appGrp.ApproverGroupTypeId == LoanManager.Configuration.ApproverGroupType.DCEO_DGM
                                        &&
                                        (appMap.StatusId == LoanManager.Configuration.ApprovalStatus.InProgress)
                                        &&
                                        appGrpMem.EmployeeId == objEmployee.Id

                                        select new
                                        {
                                            c.Id,
                                            c.ApplicationId,
                                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                                            BusinessPhone = c.Contact.BusinessPhone,
                                            HomePhone = c.Contact.HomePhone,
                                            Mobile = c.Contact.Mobile,
                                            Email = c.Contact.Email,
                                            LoanType = c.LoanType.Name,
                                            Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                                            ApplicationDate = c.ApplicationDate,
                                            LoanAmount = c.RequestedLoanAmount,
                                            Status = c.ApplicationStatus.Name
                                        };


                        return await Task.Run(() => DataSourceLoader.Load(queryLoan.Distinct(), options));

                        #endregion
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.CreditAdministrationProcessorOfficer ||
                             positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.CreditAdministrationHead
                        )
                    {

                        #region Credit Administrator


                        var queryLoan = from c in this.loanApplicationManager.GetAll()
                                                       .Include(t => t.Contact)
                                                       .Include(t => t.ApplicationStatus)
                                                       .Include(t => t.LoanType)
                                                       .Include(t => t.Branch)
                                        join customCat in this.customCategoryRepository.GetAll() on c.ApplicationStatusId equals customCat.Id
                                        where
                                        customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.Approved
                                        &&
                                        (branchId > 0 ? c.BranchId == branchId : c.BranchId == c.BranchId)
                                        &&
                                        c.IsSubmittedToCreditAdministrator


                                        select new
                                        {
                                            c.Id,
                                            c.ApplicationId,
                                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                                            BusinessPhone = c.Contact.BusinessPhone,
                                            HomePhone = c.Contact.HomePhone,
                                            Mobile = c.Contact.Mobile,
                                            Email = c.Contact.Email,
                                            LoanType = c.LoanType.Name,
                                            Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                                            ApplicationDate = c.ApplicationDate,
                                            LoanAmount = c.RequestedLoanAmount,
                                            Status = c.ApplicationStatus.Name
                                        };


                        return await Task.Run(() => DataSourceLoader.Load(queryLoan, options));

                        #endregion

                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.CEO)
                    {
                        #region CEO

                        var queryLoan = from c in this.loanApplicationManager.GetAll()
                                                       .Include(t => t.Contact)
                                                       .Include(t => t.ApplicationStatus)
                                                       .Include(t => t.LoanType)
                                                       .Include(t => t.Branch)
                                                       .Include(t => t.ApprovalEntityMappings)
                                        join customCat in this.customCategoryRepository.GetAll() on c.ApplicationStatusId equals customCat.Id
                                        join appMap in this.loanApplicationApprovalMappingManager.GetAll() on c.Id equals appMap.ApplicationId
                                        //join appProc in this.approvalProcessRepository.GetAll() on appMap.ApprovalProcessId equals appProc.Id
                                        join appProcStep in this.approvalProcessStepRepository.GetAll() on appMap.ApprovalProcessStepId equals appProcStep.Id
                                        join appGrp in this.approverGroupMappingManager.GetAll() on appProcStep.ApproverGroupId equals appGrp.Id
                                        join appGrpMem in this.approverGroupMemberMappingManager.GetAll() on appGrp.Id equals appGrpMem.ApprovalGroupId

                                        where
                                        (customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.InProgress)
                                        &&
                                        (branchId > 0 ? c.BranchId == branchId : c.BranchId == c.BranchId)
                                        &&
                                        appGrp.ApproverGroupTypeId == LoanManager.Configuration.ApproverGroupType.CEO
                                        &&
                                        (appMap.StatusId == LoanManager.Configuration.ApprovalStatus.InProgress)
                                        &&
                                        appGrpMem.EmployeeId == objEmployee.Id


                                        select new
                                        {
                                            c.Id,
                                            c.ApplicationId,
                                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                                            BusinessPhone = c.Contact.BusinessPhone,
                                            HomePhone = c.Contact.HomePhone,
                                            Mobile = c.Contact.Mobile,
                                            Email = c.Contact.Email,
                                            LoanType = c.LoanType.Name,
                                            Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                                            ApplicationDate = c.ApplicationDate,
                                            LoanAmount = c.RequestedLoanAmount,
                                            Status = c.ApplicationStatus.Name
                                        };


                        return await Task.Run(() => DataSourceLoader.Load(queryLoan.Distinct(), options));

                        #endregion
                    }
                }
            }


            if (LoggedInUser.IsSystemAdmin)
            {

                var queryAdmin = from c in this.loanApplicationManager.GetAll()
                                  .Include(t => t.Contact)
                                  .Include(t => t.ApplicationStatus)
                                  .Include(t => t.LoanType)
                                  .Include(t => t.Branch)

                                 select new
                                 {
                                     c.Id,
                                     c.ApplicationId,
                                     ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                                     Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                                     BusinessPhone = c.Contact.BusinessPhone,
                                     HomePhone = c.Contact.HomePhone,
                                     Mobile = c.Contact.Mobile,
                                     Email = c.Contact.Email,
                                     LoanType = c.LoanType.Name,
                                     Branch = c.Branch.BranchName,
                                     //Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                                     ApplicationDate = c.ApplicationDate,
                                     LoanAmount = c.RequestedLoanAmount,
                                     Status = c.ApplicationStatus.Name
                                 };


                return await Task.Run(() => DataSourceLoader.Load(queryAdmin, options));

            }


            var query = from c in this.loanApplicationManager.GetAll()
                        .Include(t => t.Contact)
                        .Include(t => t.ApplicationStatus)
                        .Include(t => t.LoanType)
                        .Include(t => t.Branch)
                        where c.ContactId == 0
                        select new
                        {
                            c.Id,
                            c.ApplicationId,
                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                            BusinessPhone = c.Contact.BusinessPhone,
                            HomePhone = c.Contact.HomePhone,
                            Mobile = c.Contact.Mobile,
                            Email = c.Contact.Email,
                            LoanType = c.LoanType.Name,
                            Branch = c.Branch.BranchName,
                            //Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                            ApplicationDate = c.ApplicationDate,
                            LoanAmount = c.RequestedLoanAmount,
                            Status = c.ApplicationStatus.Name
                        };


            return await Task.Run(() => DataSourceLoader.Load(query, options));
        }

        /// <summary>
        /// Get contacts by company
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public async Task<LoadResult> GetDevexSubmittedLoanApplicationsAsync(DataSourceLoadOptionsBase options)
        {
            long loggedInUserContactId = LoggedInUser.ContectId;
            long postingZoneId = 0;
            long positionMapTypeId = 0;
            long branchId = 0;

            var objEmployee = this.employeeManager.Where(t => t.ContactId == loggedInUserContactId).FirstOrDefault();

            if (objEmployee != null)
            {
                Contact contactObj = await this.contactManager.Where(t => t.Id == loggedInUserContactId)
                                                              .Include(t => t.Postion)
                                                              .Include(t => t.PostingZone)
                                                              .Include(t => t.Branch)
                                                              .FirstOrDefaultAsync();

                if (contactObj != null)
                {
                    postingZoneId = contactObj.PostingZoneId.Value;
                    positionMapTypeId = contactObj.Postion.CustomCategoryMapTypeOptionId.HasValue ? contactObj.Postion.CustomCategoryMapTypeOptionId.Value : 0;
                    branchId = contactObj.BranchId.HasValue ? contactObj.BranchId.Value : 0;

                    //if position mapType == 
                    if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.CreditOfficer)
                    {
                        #region Credit Officer


                        var queryLoan = from c in this.loanApplicationManager.GetAll()
                                                       .Include(t => t.Contact)
                                                       .Include(t => t.ApplicationStatus)
                                                       .Include(t => t.LoanType)
                                                       .Include(t => t.Branch)
                                        join customCat in this.customCategoryRepository.GetAll() on c.ApplicationStatusId equals customCat.Id
                                        where
                                        (customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.NotStarted
                                        || customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.InProgress
                                        || customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.Approved
                                        || customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.Rejected)
                                        &&
                                        (branchId > 0 ? c.BranchId == branchId : c.BranchId == c.BranchId)


                                        select new
                                        {
                                            c.Id,
                                            c.ApplicationId,
                                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                                            BusinessPhone = c.Contact.BusinessPhone,
                                            HomePhone = c.Contact.HomePhone,
                                            Mobile = c.Contact.Mobile,
                                            Email = c.Contact.Email,
                                            LoanType = c.LoanType.Name,
                                            Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                                            ApplicationDate = c.ApplicationDate,
                                            LoanAmount = c.RequestedLoanAmount,
                                            Status = c.ApplicationStatus.Name
                                        };


                        return await Task.Run(() => DataSourceLoader.Load(queryLoan, options));

                        #endregion
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.BranchManager)
                    {
                        #region Branch Manager

                        var queryLoan = from c in this.loanApplicationManager.GetAll()
                                                       .Include(t => t.Contact)
                                                       .Include(t => t.ApplicationStatus)
                                                       .Include(t => t.LoanType)
                                                       .Include(t => t.Branch)
                                                       .Include(t => t.ApprovalEntityMappings)
                                        join customCat in this.customCategoryRepository.GetAll() on c.ApplicationStatusId equals customCat.Id
                                        join appMap in this.loanApplicationApprovalMappingManager.GetAll() on c.Id equals appMap.ApplicationId
                                        //join appProc in this.approvalProcessRepository.GetAll() on appMap.ApprovalProcessId equals appProc.Id
                                        join appProcStep in this.approvalProcessStepRepository.GetAll() on appMap.ApprovalProcessStepId equals appProcStep.Id
                                        join appGrp in this.approverGroupMappingManager.GetAll() on appProcStep.ApproverGroupId equals appGrp.Id
                                        join appGrpMem in this.approverGroupMemberMappingManager.GetAll() on appGrp.Id equals appGrpMem.ApprovalGroupId

                                        where
                                        //(customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.InProgress)
                                        //&&
                                        (branchId > 0 ? c.BranchId == branchId : c.BranchId == c.BranchId)
                                        &&
                                        appGrp.ApproverGroupTypeId == LoanManager.Configuration.ApproverGroupType.BranchManager
                                        &&
                                        //appMap.StatusId == LoanManager.Configuration.ApprovalStatus.InProgress
                                        appMap.IsSubmittedAction == true
                                        &&
                                        appGrpMem.EmployeeId == objEmployee.Id


                                        select new
                                        {
                                            c.Id,
                                            c.ApplicationId,
                                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                                            BusinessPhone = c.Contact.BusinessPhone,
                                            HomePhone = c.Contact.HomePhone,
                                            Mobile = c.Contact.Mobile,
                                            Email = c.Contact.Email,
                                            LoanType = c.LoanType.Name,
                                            Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                                            ApplicationDate = c.ApplicationDate,
                                            LoanAmount = c.RequestedLoanAmount,
                                            Status = c.ApplicationStatus.Name
                                        };


                        return await Task.Run(() => DataSourceLoader.Load(queryLoan.Distinct(), options));

                        #endregion
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.ClusterHead)
                    {
                        #region Cluster Head

                        var queryLoan = from c in this.loanApplicationManager.GetAll()
                                                       .Include(t => t.Contact)
                                                       .Include(t => t.ApplicationStatus)
                                                       .Include(t => t.LoanType)
                                                       .Include(t => t.Branch)
                                                       .Include(t => t.ApprovalEntityMappings)
                                        join customCat in this.customCategoryRepository.GetAll() on c.ApplicationStatusId equals customCat.Id
                                        join appMap in this.loanApplicationApprovalMappingManager.GetAll() on c.Id equals appMap.ApplicationId
                                        //join appProc in this.approvalProcessRepository.GetAll() on appMap.ApprovalProcessId equals appProc.Id
                                        join appProcStep in this.approvalProcessStepRepository.GetAll() on appMap.ApprovalProcessStepId equals appProcStep.Id
                                        join appGrp in this.approverGroupMappingManager.GetAll() on appProcStep.ApproverGroupId equals appGrp.Id
                                        join appGrpMem in this.approverGroupMemberMappingManager.GetAll() on appGrp.Id equals appGrpMem.ApprovalGroupId

                                        where
                                        //(customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.InProgress)
                                        //&&
                                        (branchId > 0 ? c.BranchId == branchId : c.BranchId == c.BranchId)
                                        &&
                                        appGrp.ApproverGroupTypeId == LoanManager.Configuration.ApproverGroupType.ClusterHead
                                        &&
                                        appMap.IsSubmittedAction == true
                                        //appMap.StatusId == LoanManager.Configuration.ApprovalStatus.InProgress
                                        //||
                                        //appMap.StatusId == LoanManager.Configuration.ApprovalStatus.Review
                                        //)
                                        &&
                                        appGrpMem.EmployeeId == objEmployee.Id

                                        select new
                                        {
                                            c.Id,
                                            c.ApplicationId,
                                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                                            BusinessPhone = c.Contact.BusinessPhone,
                                            HomePhone = c.Contact.HomePhone,
                                            Mobile = c.Contact.Mobile,
                                            Email = c.Contact.Email,
                                            LoanType = c.LoanType.Name,
                                            Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                                            ApplicationDate = c.ApplicationDate,
                                            LoanAmount = c.RequestedLoanAmount,
                                            Status = c.ApplicationStatus.Name
                                        };


                        return await Task.Run(() => DataSourceLoader.Load(queryLoan.Distinct(), options));

                        #endregion
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.CreditOperationHead)
                    {
                        #region Credit Operation

                        var queryLoan = from c in this.loanApplicationManager.GetAll()
                                                       .Include(t => t.Contact)
                                                       .Include(t => t.ApplicationStatus)
                                                       .Include(t => t.LoanType)
                                                       .Include(t => t.Branch)
                                                       .Include(t => t.ApprovalEntityMappings)
                                        join customCat in this.customCategoryRepository.GetAll() on c.ApplicationStatusId equals customCat.Id
                                        join appMap in this.loanApplicationApprovalMappingManager.GetAll() on c.Id equals appMap.ApplicationId
                                        join appProcStep in this.approvalProcessStepRepository.GetAll() on appMap.ApprovalProcessStepId equals appProcStep.Id
                                        join appProc in this.approvalProcessRepository.GetAll() on appProcStep.ApprovalProcessId equals appProc.Id
                                        join appGrp in this.approverGroupMappingManager.GetAll() on appProcStep.ApproverGroupId equals appGrp.Id
                                        join appGrpMem in this.approverGroupMemberMappingManager.GetAll() on appGrp.Id equals appGrpMem.ApprovalGroupId

                                        where
                                        //(customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.InProgress)
                                        //&&
                                        (branchId > 0 ? c.BranchId == branchId : c.BranchId == c.BranchId)
                                         &&
                                        appGrp.ApproverGroupTypeId == LoanManager.Configuration.ApproverGroupType.CreditOperation
                                        &&
                                        appMap.IsSubmittedAction == true
                                        //appMap.StatusId == LoanManager.Configuration.ApprovalStatus.InProgress
                                        //||
                                        //appMap.StatusId == LoanManager.Configuration.ApprovalStatus.Review
                                        //)
                                        &&
                                        appGrpMem.EmployeeId == objEmployee.Id

                                        select new
                                        {
                                            c.Id,
                                            c.ApplicationId,
                                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                                            BusinessPhone = c.Contact.BusinessPhone,
                                            HomePhone = c.Contact.HomePhone,
                                            Mobile = c.Contact.Mobile,
                                            Email = c.Contact.Email,
                                            LoanType = c.LoanType.Name,
                                            Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                                            ApplicationDate = c.ApplicationDate,
                                            LoanAmount = c.RequestedLoanAmount,
                                            Status = c.ApplicationStatus.Name
                                        };


                        return await Task.Run(() => DataSourceLoader.Load(queryLoan.Distinct(), options));

                        #endregion
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.RiskOfficer ||
                            positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.LegalOfficer ||
                            positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.ComplianceOfficer
                        )
                    {

                        #region Risk, Legal & Compliance Operation

                        var queryLoan = from c in this.loanApplicationManager.GetAll()
                                                       .Include(t => t.Contact)
                                                       .Include(t => t.ApplicationStatus)
                                                       .Include(t => t.LoanType)
                                                       .Include(t => t.Branch)
                                                       .Include(t => t.ApprovalEntityMappings)
                                        join customCat in this.customCategoryRepository.GetAll() on c.ApplicationStatusId equals customCat.Id
                                        join appMap in this.loanApplicationApprovalMappingManager.GetAll() on c.Id equals appMap.ApplicationId
                                        join appProcStep in this.approvalProcessStepRepository.GetAll() on appMap.ApprovalProcessStepId equals appProcStep.Id
                                        join appProc in this.approvalProcessRepository.GetAll() on appProcStep.ApprovalProcessId equals appProc.Id
                                        join appGrp in this.approverGroupMappingManager.GetAll() on appProcStep.ApproverGroupId equals appGrp.Id
                                        join appGrpMem in this.approverGroupMemberMappingManager.GetAll() on appGrp.Id equals appGrpMem.ApprovalGroupId

                                        where
                                        //(customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.InProgress)
                                        //&&
                                        (branchId > 0 ? c.BranchId == branchId : c.BranchId == c.BranchId)
                                         &&
                                        appGrp.ApproverGroupTypeId == LoanManager.Configuration.ApproverGroupType.Risk_LegalAndCompliance
                                        &&
                                        appMap.IsSubmittedAction == true
                                        //appMap.StatusId == LoanManager.Configuration.ApprovalStatus.InProgress
                                        //||
                                        //appMap.StatusId == LoanManager.Configuration.ApprovalStatus.Review
                                        //)
                                        &&
                                        appGrpMem.EmployeeId == objEmployee.Id


                                        select new
                                        {
                                            c.Id,
                                            c.ApplicationId,
                                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                                            BusinessPhone = c.Contact.BusinessPhone,
                                            HomePhone = c.Contact.HomePhone,
                                            Mobile = c.Contact.Mobile,
                                            Email = c.Contact.Email,
                                            LoanType = c.LoanType.Name,
                                            Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                                            ApplicationDate = c.ApplicationDate,
                                            LoanAmount = c.RequestedLoanAmount,
                                            Status = c.ApplicationStatus.Name
                                        };


                        return await Task.Run(() => DataSourceLoader.Load(queryLoan.Distinct(), options));

                        #endregion

                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.DCEO_DGMCEO)
                    {
                        #region Deputy CEO

                        var queryLoan = from c in this.loanApplicationManager.GetAll()
                                                       .Include(t => t.Contact)
                                                       .Include(t => t.ApplicationStatus)
                                                       .Include(t => t.LoanType)
                                                       .Include(t => t.Branch)
                                                       .Include(t => t.ApprovalEntityMappings)
                                        join customCat in this.customCategoryRepository.GetAll() on c.ApplicationStatusId equals customCat.Id
                                        join appMap in this.loanApplicationApprovalMappingManager.GetAll() on c.Id equals appMap.ApplicationId
                                        //join appProc in this.approvalProcessRepository.GetAll() on appMap.ApprovalProcessId equals appProc.Id
                                        join appProcStep in this.approvalProcessStepRepository.GetAll() on appMap.ApprovalProcessStepId equals appProcStep.Id
                                        join appGrp in this.approverGroupMappingManager.GetAll() on appProcStep.ApproverGroupId equals appGrp.Id
                                        join appGrpMem in this.approverGroupMemberMappingManager.GetAll() on appGrp.Id equals appGrpMem.ApprovalGroupId

                                        where
                                        //(customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.InProgress)
                                        //&&
                                        (branchId > 0 ? c.BranchId == branchId : c.BranchId == c.BranchId)
                                        &&
                                        appGrp.ApproverGroupTypeId == LoanManager.Configuration.ApproverGroupType.DCEO_DGM
                                        &&
                                        //(appMap.StatusId == LoanManager.Configuration.ApprovalStatus.InProgress)
                                         appMap.IsSubmittedAction == true
                                         &&
                                         appGrpMem.EmployeeId == objEmployee.Id


                                        select new
                                        {
                                            c.Id,
                                            c.ApplicationId,
                                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                                            BusinessPhone = c.Contact.BusinessPhone,
                                            HomePhone = c.Contact.HomePhone,
                                            Mobile = c.Contact.Mobile,
                                            Email = c.Contact.Email,
                                            LoanType = c.LoanType.Name,
                                            Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                                            ApplicationDate = c.ApplicationDate,
                                            LoanAmount = c.RequestedLoanAmount,
                                            Status = c.ApplicationStatus.Name
                                        };


                        return await Task.Run(() => DataSourceLoader.Load(queryLoan.Distinct(), options));

                        #endregion
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.CreditAdministrationProcessorOfficer ||
                             positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.CreditAdministrationHead
                        )
                    {

                        #region Credit Administrator


                        var queryLoan = from c in this.loanApplicationManager.GetAll()
                                                       .Include(t => t.Contact)
                                                       .Include(t => t.ApplicationStatus)
                                                       .Include(t => t.LoanType)
                                                       .Include(t => t.Branch)
                                        join customCat in this.customCategoryRepository.GetAll() on c.ApplicationStatusId equals customCat.Id
                                        where
                                        customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.Approved
                                        &&
                                        (branchId > 0 ? c.BranchId == branchId : c.BranchId == c.BranchId)
                                        &&
                                        c.IsSubmittedToCreditAdministrator


                                        select new
                                        {
                                            c.Id,
                                            c.ApplicationId,
                                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                                            BusinessPhone = c.Contact.BusinessPhone,
                                            HomePhone = c.Contact.HomePhone,
                                            Mobile = c.Contact.Mobile,
                                            Email = c.Contact.Email,
                                            LoanType = c.LoanType.Name,
                                            Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                                            ApplicationDate = c.ApplicationDate,
                                            LoanAmount = c.RequestedLoanAmount,
                                            Status = c.ApplicationStatus.Name
                                        };


                        return await Task.Run(() => DataSourceLoader.Load(queryLoan, options));

                        #endregion

                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.CEO)
                    {
                        #region CEO

                        var queryLoan = from c in this.loanApplicationManager.GetAll()
                                                       .Include(t => t.Contact)
                                                       .Include(t => t.ApplicationStatus)
                                                       .Include(t => t.LoanType)
                                                       .Include(t => t.Branch)
                                                       .Include(t => t.ApprovalEntityMappings)
                                        join customCat in this.customCategoryRepository.GetAll() on c.ApplicationStatusId equals customCat.Id
                                        join appMap in this.loanApplicationApprovalMappingManager.GetAll() on c.Id equals appMap.ApplicationId
                                        //join appProc in this.approvalProcessRepository.GetAll() on appMap.ApprovalProcessId equals appProc.Id
                                        join appProcStep in this.approvalProcessStepRepository.GetAll() on appMap.ApprovalProcessStepId equals appProcStep.Id
                                        join appGrp in this.approverGroupMappingManager.GetAll() on appProcStep.ApproverGroupId equals appGrp.Id
                                        join appGrpMem in this.approverGroupMemberMappingManager.GetAll() on appGrp.Id equals appGrpMem.ApprovalGroupId

                                        where
                                        //(customCat.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.InProgress)
                                        //&&
                                        (branchId > 0 ? c.BranchId == branchId : c.BranchId == c.BranchId)
                                        &&
                                        appGrp.ApproverGroupTypeId == LoanManager.Configuration.ApproverGroupType.CEO
                                        &&
                                        //(appMap.StatusId == LoanManager.Configuration.ApprovalStatus.InProgress)
                                         appMap.IsSubmittedAction == true
                                         &&
                                         appGrpMem.EmployeeId == objEmployee.Id


                                        select new
                                        {
                                            c.Id,
                                            c.ApplicationId,
                                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                                            BusinessPhone = c.Contact.BusinessPhone,
                                            HomePhone = c.Contact.HomePhone,
                                            Mobile = c.Contact.Mobile,
                                            Email = c.Contact.Email,
                                            LoanType = c.LoanType.Name,
                                            Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                                            ApplicationDate = c.ApplicationDate,
                                            LoanAmount = c.RequestedLoanAmount,
                                            Status = c.ApplicationStatus.Name
                                        };


                        return await Task.Run(() => DataSourceLoader.Load(queryLoan.Distinct(), options));

                        #endregion
                    }
                }
            }




            var query = from c in this.loanApplicationManager.GetAll()
                        .Include(t => t.Contact)
                        .Include(t => t.ApplicationStatus)
                        .Include(t => t.LoanType)
                        .Include(t => t.Branch)
                        where c.ContactId == 0
                        select new
                        {
                            c.Id,
                            c.ApplicationId,
                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                            BusinessPhone = c.Contact.BusinessPhone,
                            HomePhone = c.Contact.HomePhone,
                            Mobile = c.Contact.Mobile,
                            Email = c.Contact.Email,
                            LoanType = c.LoanType.Name,
                            Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                            ApplicationDate = c.ApplicationDate,
                            LoanAmount = c.RequestedLoanAmount,
                            Status = c.ApplicationStatus.Name
                        };


            return await Task.Run(() => DataSourceLoader.Load(query, options));
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="contactId"></param>
        /// <returns></returns>
        public async Task<List<CustomLoanApplicationModel>> GetActiveCustomLoanApplicationsAsync(long contactId)
        {
            contactId = LoggedInUser.ContectId;
            var query = from c in this.loanApplicationManager.GetAll()
                        .Include(t => t.Contact)
                        .Include(t => t.ApplicationStatus)
                        .Include(t => t.LoanType)
                        .Include(t => t.Branch)
                        .Where(t => t.ContactId == contactId)
                        select new CustomLoanApplicationModel
                        {
                            Id = c.Id,
                            ApplicationId = c.ApplicationId,
                            ApplicantName = c.Contact.FirstName + " " + c.Contact.LastName,
                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                            BusinessPhone = c.Contact.BusinessPhone,
                            HomePhone = c.Contact.HomePhone,
                            Mobile = c.Contact.Mobile,
                            Email = c.Contact.Email,
                            LoanType = c.LoanType.Name,
                            Branch = c.Branch.BranchName + " (Address: " + c.Branch.Address + ", Phone: " + c.Branch.Phone + ", Fax: " + c.Branch.Fax + ", Email: " + c.Branch.Email + ")",
                            ApplicationDate = c.ApplicationDate,
                            LoanAmount = c.RequestedLoanAmount,
                            Status = c.ApplicationStatus.Name
                        };

            return await Task.Run(() => query.ToList());
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

            tabModels.Add(new TabModel(2, "Documents", "documents"));
            tabModels.Add(new TabModel(4, "User Notes", "user-notes"));
            tabModels.Add(new TabModel(3, "System Notes", "system-notes"));
            tabModels.Add(new TabModel(5, "Q & A", "qa-notes"));
            tabModels.Add(new TabModel(6, "Checklist", "checklist"));

            return tabModels;
        }

        #endregion

        #region Save/Update Application Methods

        public async Task<long> InsertLoanApplicationValuesAsync(LoanApplicationModel applicationModel)
        {
            if (applicationModel == null)
            {
                throw new ItmArgumentMissingException("Invalid application data");
            }


            LoanApplication loanApplication = new LoanApplication();

            //if (!applicationModel.Contact.Photo.IsUpdated && !applicationModel.Contact.Photo.IsDeleted)
            //{
            //    applicationModel.Contact.Photo = null;
            //}

            if (loanApplication != null)
            {
                if (loanApplication.Contact == null)
                    loanApplication.Contact = new Contact();

                Mapper.Map(applicationModel, loanApplication);


                if (applicationModel.LoanTypeId != null && applicationModel.LoanTypeId > 0)
                {
                    var loanTypeCustomFieldList = this.customFieldMasterRepository.Where(t => t.EntityId == applicationModel.LoanTypeId).ToList();
                    if (loanTypeCustomFieldList != null)
                    {
                        foreach (var customField in loanTypeCustomFieldList)
                        {
                            ApplicationCustomField appCustom = new ApplicationCustomField();
                            appCustom.CustomFieldMasterId = customField.Id;
                            appCustom.IsOnlySingleValue = true;
                            loanApplication.ApplicationCustomFields.Add(appCustom);
                        }
                    }
                }


                if (applicationModel.Contact.Id == 0)
                {
                    loanApplication.Contact.FirstName = "";
                    loanApplication.Contact.LastName = "";
                    loanApplication.Contact.ContactType = (int)LoanManager.Configuration.Enums.ContactType.Client;
                    loanApplication.Contact.BusinessPhone = applicationModel.Contact.BusinessPhone;
                    loanApplication.Contact.Mobile = applicationModel.Contact.Mobile;
                    loanApplication.Contact.Email = loanApplication.Contact.Email;
                    loanApplication.Contact.Photo = null;
                }
                else
                {
                    var objContact = this.contactManager.Where(t => t.Id == applicationModel.Contact.Id).FirstOrDefault();
                    loanApplication.Contact = objContact;
                }

                var statusApproval = this.customCategoryRepository
                                .Where(t => t.CustomCategoryTypeId == ApplicationCustomCategory.ApprovalStatusType
                                && t.CustomCategoryMapTypeOptionId == ApplicationMapType.ApprovalStatusType.NotStarted)
                                .FirstOrDefault();

                if (statusApproval != null)
                    loanApplication.ApplicationStatusId = statusApproval.Id;

                loanApplication.ApplicationDate = DateTime.Now;
                loanApplication.ApplicationId = this.GetNextApplicationID();
                await loanApplicationManager.CreateAsync(loanApplication);

                this.SendNewApplicationGroupMail(loanApplication.AssignedEmployeeId.Value, loanApplication.ApplicationId);

                //photo entity 
                //if (!string.IsNullOrEmpty(applicationModel.Contact.Photo?.UploadedFileName))
                //{
                //    Photo photo = new Photo();
                //    photo.PhotoThumb = this.photoService.GetImageFile(applicationModel.Contact.Photo.UploadedFileName);
                //    photo.FileName = applicationModel.Contact.FirstName + "_" + applicationModel.Contact.LastName;
                //    photo.IsDefault = true;
                //    photo.IsVisibleInPublicPortal = true;
                //    loanApplication.Contact.Photo = photo;
                //}
            }
            return loanApplication.Id;
        }

        public async Task<long> UpdateLoanApplicationValuesAsync(LoanApplicationModel applicationModel)
        {
            if (applicationModel == null)
            {
                throw new ItmArgumentMissingException("Invalid user data");
            }


            LoanApplication loanApplicationObj = new LoanApplication();

            //if (!applicationModel.ContactModel.Photo.IsUpdated && !applicationModel.ContactModel.Photo.IsDeleted)
            //{
            //    applicationModel.Contact.Photo = null;
            //}

            if (applicationModel.Contact.Photo != null)
            {
                loanApplicationObj = await loanApplicationManager.Where(t => t.Id == applicationModel.Id)
                                                               .Include(t => t.Contact).ThenInclude(t => t.Photo)
                                                               //.Include(t=>t.ApplicationCustomFields)
                                                               .FirstOrDefaultAsync();
            }
            else
            {
                loanApplicationObj = await loanApplicationManager.Where(t => t.Id == applicationModel.Id)
                                                               .Include(t => t.Contact)
                                                               //.Include(t => t.ApplicationCustomFields)
                                                               .FirstOrDefaultAsync();
            }

            if (loanApplicationObj == null)
            {
                throw new ItmNotFoundException("Application User not found");
            }

            //var objCustomField = applicationModel.ApplicationCustomFields;
            //applicationModel.ApplicationCustomFields = null;

            if (loanApplicationObj != null)
            {
                applicationModel.AssignedEmployee = null;
                Mapper.Map(applicationModel, loanApplicationObj);
                loanApplicationObj.ApplicationCustomFields = null;

                //loanApplicationObj.Contact.HomePhone = applicationModel.Contact.HomePhone;                              
                //await userManager.ChangePasswordAsync(userObj, userObj.PasswordHash, userModel.NewPassword);

                await loanApplicationManager.UpdateAsync(loanApplicationObj);
                this.UpdateCustomFieldValues(applicationModel);
                this.AddNoteForCurrentAssignee(applicationModel);
                //Delete photo
                //if (applicationModel.Contact.Photo != null && applicationModel.Contact.Photo.IsDeleted)
                //{
                //    photoRepository.Delete(p => p.Id == applicationModel.Contact.Photo.Id);
                //}
            }

            return loanApplicationObj.Id;
        }

        public void UpdateCustomFieldValues(LoanApplicationModel applicationModel)
        {
            if (applicationModel.ApplicationCustomFields.Count > 0)
            {
                foreach (var custom in applicationModel.ApplicationCustomFields)
                {
                    var customFiledObj = this.applicationCustomFieldManager.Where(t => t.Id == custom.Id).FirstOrDefault();
                    if (customFiledObj != null)
                    {
                        customFiledObj.Value = custom.Value;
                        this.applicationCustomFieldManager.Update(customFiledObj);
                    }
                }
            }
        }

        public void AddNoteForCurrentAssignee(LoanApplicationModel applicationModel)
        {
            long loggedInUserContactId = LoggedInUser.ContectId;
            Employee empObj = this.employeeManager.Where(t => t.ContactId == loggedInUserContactId).FirstOrDefault();

            if (empObj != null)
            {
                if (applicationModel.CurrentAssignedEmployeeId.HasValue)
                {
                    Note obj = new Note();
                    obj.EntityTypeId = LoanManager.Configuration.ApplicationEntityType.Application;
                    obj.EntityId = applicationModel.Id;
                    obj.NoteDetail = applicationModel.CurrentAssigneeComments;
                    obj.CreatedByContactId = LoggedInUser.ContectId;
                    obj.DateCreated = DateTime.Now;
                    obj.IsPrivate = false;
                    obj.NoteTypeId = LoanManager.Configuration.NoteType.QuestionsAndAnswers;
                    obj.AssignedByEmployeeId = empObj.Id;
                    obj.AssignedToEmployeeId = applicationModel.CurrentAssignedEmployeeId;
                    this.noteRepository.Create(obj);

                    if (applicationModel.CurrentAssignedEmployeeId.HasValue)
                        this.AssignEmployeeForCommunicationWithinApprovalProcessMail(empObj.Id, applicationModel.CurrentAssignedEmployeeId.Value, applicationModel.ApplicationId);
                }
            }
        }

        #endregion

        #region Get Methods

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<LoanApplicationModel> GetLoanApplicationByIdAsync(long id)
        {
            if (id == 0)
            {
                LoanApplicationModel loanApp = new LoanApplicationModel();
                Contact con = this.contactManager.GetAll().FirstOrDefault(t => t.Id == LoggedInUser.ContectId);
                //Contact con = this.contactManager.GetAll().FirstOrDefault(t => t.Id == 1);              
                loanApp.Contact = Mapper.Map<ContactModel>(con); //con;
                loanApp.RequestedLoanAmount = 0;
                return loanApp;
            }

            LoanApplication loanApplication = await loanApplicationManager.Where(t => t.Id == id)
                                                               .Include(t => t.Contact).ThenInclude(t => t.Photo)
                                                               //.Include(t => t.ApplicationStatus)
                                                               //.Include(t => t.LoanType)
                                                               //.Include(t => t.Branch)
                                                               .Include(t => t.ApplicationCustomFields).ThenInclude(p => p.CustomFieldMaster)
                                                               .FirstOrDefaultAsync();

            if (loanApplication == null)
            {
                throw new ItmNotFoundException("Application not found");
            }


            var obj = Mapper.Map<LoanApplicationModel>(loanApplication);
            var customFieldGroup = loanApplication.ApplicationCustomFields
                                   .OrderBy(t => t.CustomFieldMaster.GroupSortOrder)
                                   .Select(t => t.CustomFieldMaster.GroupName)
                                   .Distinct().ToList();

            obj.CustomFieldGroup = customFieldGroup;

            return obj;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<LoanApplicationModel> GetLoanApplicationByIdForAdminAsync(long id)
        {
            if (id == 0)
            {
                LoanApplicationModel loanApp = new LoanApplicationModel();
                loanApp.RequestedLoanAmount = 0;
                return loanApp;
            }

            LoanApplication loanApplicationWithoutSort = await loanApplicationManager.Where(t => t.Id == id)
                                                               .Include(t => t.Contact).ThenInclude(t => t.Photo)
                                                               .Include(t => t.ApplicationStatus)
                                                               .Include(t => t.AssignedEmployee)
                                                               //.Include(t => t.LoanType)
                                                               //.Include(t => t.Branch)
                                                               .Include(t => t.ApplicationCustomFields).ThenInclude(p => p.CustomFieldMaster)
                                                               .FirstOrDefaultAsync();

            if (loanApplicationWithoutSort == null)
            {
                throw new ItmNotFoundException("Application not found");
            }

            LoanApplication loanApplication = new LoanApplication();
            loanApplication = loanApplicationWithoutSort;
            loanApplication.ApplicationCustomFields = loanApplicationWithoutSort.ApplicationCustomFields.OrderBy(t => t.CustomFieldMaster.ControlSortOrder).ToList();

            var obj = Mapper.Map<LoanApplicationModel>(loanApplication);
            var customFieldGroup = loanApplication.ApplicationCustomFields
                                   .OrderBy(t => t.CustomFieldMaster.GroupSortOrder)
                                   .Select(t => t.CustomFieldMaster.GroupName)
                                   .Distinct().ToList();

            obj.CustomFieldGroup = customFieldGroup;
            obj.LoginUserId = LoggedInUser.ContectId;

            if (obj.CurrentAssignedEmployeeId != null)
            {
                long currentAssignedEmployeeContactId = this.employeeManager.Where(t => t.Id == obj.CurrentAssignedEmployeeId).FirstOrDefault().ContactId;
                obj.CurrentAssignedEmployeeContactId = currentAssignedEmployeeContactId;
            }

            if (obj.AssignedEmployee != null)
                obj.AssignedContactId = obj.AssignedEmployee.ContactId;

            //get loan status map type
            long loanStatusMapTypeId = loanApplication.ApplicationStatusId.HasValue ? loanApplication.ApplicationStatus.CustomCategoryMapTypeOptionId.Value : 0;

            if (loanStatusMapTypeId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.InProgress)
            {
                var mappingObj = this.loanApplicationApprovalMappingManager
                                        .Where(t => t.ApplicationId == obj.Id && (t.StatusId == LoanManager.Configuration.ApprovalStatus.InProgress
                                                                               || t.StatusId == LoanManager.Configuration.ApprovalStatus.Review))
                                        .FirstOrDefault();

                if (mappingObj != null)
                {
                    obj.ApprovalMappingId = mappingObj.Id;
                    obj.IsCreditOperationNeeded = mappingObj.IsCreditOperationNeeded;
                    obj.IsRiskLegalNeeded = mappingObj.IsRiskLegalNeeded;
                    obj.IsSubmittedForCreditOperation = mappingObj.IsSubmittedForCreditOperation;
                    obj.IsSubmittedForRiskLegal = mappingObj.IsSubmittedForRiskLegal;
                    obj.IsClearedFromCreditOperation = mappingObj.IsClearedFromCreditOperation;
                    obj.IsClearedFromRiskLegal = mappingObj.IsClearedFromRiskLegal;


                    //mappingObj.ApprovalProcessStepId
                    var approvalStepObj = this.approvalProcessStepRepository.Where(t => t.Id == mappingObj.ApprovalProcessStepId)
                                                                            .Include(t => t.ApproverGroup)
                                                                            .FirstOrDefault();

                    if (approvalStepObj != null)
                    {
                        obj.CurrentApproverGroupTypeId = approvalStepObj.ApproverGroup.ApproverGroupTypeId;
                        approvalStepObj = null;
                    }
                }

                mappingObj = null;
            }
            else
            {
                obj.ApprovalMappingId = 0;
            }

            obj.LoanStatusMapTypeId = loanStatusMapTypeId;
            obj.ApprovalStatusId = this.GetApprovalStatus(obj.Id);

            long loggedInUserContactId = LoggedInUser.ContectId;
            long positionMapTypeId = 0;
            bool isEmployee = this.employeeManager.Where(t => t.ContactId == loggedInUserContactId).Any();

            if (isEmployee)
            {
                Contact contactObj = await this.contactManager.Where(t => t.Id == loggedInUserContactId)
                                                              .Include(t => t.Postion)
                                                              .FirstOrDefaultAsync();


                if (contactObj != null)
                {
                    positionMapTypeId = contactObj.Postion.CustomCategoryMapTypeOptionId.HasValue ? contactObj.Postion.CustomCategoryMapTypeOptionId.Value : 0;

                    if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.CreditOfficer)
                    {
                        obj.ApproverGroupTypeId = LoanManager.Configuration.ApproverGroupType.CreditOfficer;
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.BranchManager)
                    {
                        obj.ApproverGroupTypeId = LoanManager.Configuration.ApproverGroupType.BranchManager;
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.ClusterHead)
                    {
                        obj.ApproverGroupTypeId = LoanManager.Configuration.ApproverGroupType.ClusterHead;
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.CreditOperationHead)
                    {
                        obj.ApproverGroupTypeId = LoanManager.Configuration.ApproverGroupType.CreditOperation;
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.RiskOfficer ||
                            positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.LegalOfficer ||
                            positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.ComplianceOfficer
                            )
                    {
                        obj.ApproverGroupTypeId = LoanManager.Configuration.ApproverGroupType.Risk_LegalAndCompliance;
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.DCEO_DGMCEO)
                    {
                        obj.ApproverGroupTypeId = LoanManager.Configuration.ApproverGroupType.DCEO_DGM;
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.CEO)
                    {
                        obj.ApproverGroupTypeId = LoanManager.Configuration.ApproverGroupType.CEO;
                    }

                }
            }



            return obj;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<LoanApplicationModel> GetLoanApplicationByIdForAdminNotesAsync(long id)
        {
            if (id == 0)
            {
                LoanApplicationModel loanApp = new LoanApplicationModel();
                loanApp.RequestedLoanAmount = 0;
                return loanApp;
            }

            LoanApplication loanApplicationWithoutSort = await loanApplicationManager.Where(t => t.Id == id)
                                                               .Include(t => t.Contact)
                                                               .Include(t => t.ApplicationStatus)
                                                               .Include(t => t.AssignedEmployee)
                                                               .FirstOrDefaultAsync();

            if (loanApplicationWithoutSort == null)
            {
                throw new ItmNotFoundException("Application not found");
            }

            var obj = Mapper.Map<LoanApplicationModel>(loanApplicationWithoutSort);

            obj.LoginUserId = LoggedInUser.ContectId;
            if (obj.AssignedEmployee != null)
                obj.AssignedContactId = obj.AssignedEmployee.ContactId;

            //get loan status map type
            long loanStatusMapTypeId = loanApplicationWithoutSort.ApplicationStatusId.HasValue ? loanApplicationWithoutSort.ApplicationStatus.CustomCategoryMapTypeOptionId.Value : 0;

            if (loanStatusMapTypeId == LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.InProgress)
            {
                var mappingObj = this.loanApplicationApprovalMappingManager
                                        .Where(t => t.ApplicationId == obj.Id && (t.StatusId == LoanManager.Configuration.ApprovalStatus.InProgress
                                                                               || t.StatusId == LoanManager.Configuration.ApprovalStatus.Review))
                                        .FirstOrDefault();

                if (mappingObj != null)
                {
                    obj.ApprovalMappingId = mappingObj.Id;
                    obj.IsCreditOperationNeeded = mappingObj.IsCreditOperationNeeded;
                    obj.IsRiskLegalNeeded = mappingObj.IsRiskLegalNeeded;
                    obj.IsSubmittedForCreditOperation = mappingObj.IsSubmittedForCreditOperation;
                    obj.IsSubmittedForRiskLegal = mappingObj.IsSubmittedForRiskLegal;
                    obj.IsClearedFromCreditOperation = mappingObj.IsClearedFromCreditOperation;
                    obj.IsClearedFromRiskLegal = mappingObj.IsClearedFromRiskLegal;
                }

                mappingObj = null;
            }
            else
            {
                obj.ApprovalMappingId = 0;
            }

            obj.LoanStatusMapTypeId = loanStatusMapTypeId;
            obj.ApprovalStatusId = this.GetApprovalStatus(obj.Id);

            long loggedInUserContactId = LoggedInUser.ContectId;
            long positionMapTypeId = 0;
            bool isEmployee = this.employeeManager.Where(t => t.ContactId == loggedInUserContactId).Any();

            if (isEmployee)
            {
                Contact contactObj = await this.contactManager.Where(t => t.Id == loggedInUserContactId)
                                                              .Include(t => t.Postion)
                                                              .FirstOrDefaultAsync();


                if (contactObj != null)
                {
                    positionMapTypeId = contactObj.Postion.CustomCategoryMapTypeOptionId.HasValue ? contactObj.Postion.CustomCategoryMapTypeOptionId.Value : 0;

                    if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.CreditOfficer)
                    {
                        obj.ApproverGroupTypeId = LoanManager.Configuration.ApproverGroupType.CreditOfficer;
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.BranchManager)
                    {
                        obj.ApproverGroupTypeId = LoanManager.Configuration.ApproverGroupType.BranchManager;
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.ClusterHead)
                    {
                        obj.ApproverGroupTypeId = LoanManager.Configuration.ApproverGroupType.ClusterHead;
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.CreditOperationHead)
                    {
                        obj.ApproverGroupTypeId = LoanManager.Configuration.ApproverGroupType.CreditOperation;
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.RiskOfficer ||
                            positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.LegalOfficer ||
                            positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.ComplianceOfficer
                            )
                    {
                        obj.ApproverGroupTypeId = LoanManager.Configuration.ApproverGroupType.Risk_LegalAndCompliance;
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.DCEO_DGMCEO)
                    {
                        obj.ApproverGroupTypeId = LoanManager.Configuration.ApproverGroupType.DCEO_DGM;
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.CEO)
                    {
                        obj.ApproverGroupTypeId = LoanManager.Configuration.ApproverGroupType.CEO;
                    }

                }
            }



            return obj;
        }

        #endregion

        #region Delete Methods

        public Task<bool> DeleteUserByIdAsync(long id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteUsersAsync(List<long> ids)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Delete Loan Application
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<bool> DeleteLoanApplicationAsync(long id)
        {
            if (id < 1 || !await loanApplicationManager.ExistsAsync(x => x.Id == id))
            {
                throw new ItmArgumentMissingException("Loan application not found");
            }

            var validationSummary = storedProcedure.GetValidationSummary(DeletableEntityType.LoanApplication, id);
            if (validationSummary != null && !validationSummary.IsValid)
            {
                throw new ItmArgumentMissingException(validationSummary.ValidationMessage);
            }

            LoanApplication applicationModel = await loanApplicationManager.Where(t => t.Id == id)
                                                               .Include(t => t.Contact).ThenInclude(t => t.Photo)
                                                               .Include(t => t.ApplicationCustomFields).ThenInclude(p => p.CustomFieldMaster)
                                                               .Include(t => t.ApplicationDocuments)
                                                               .FirstOrDefaultAsync();

            if (applicationModel == null)
            {
                throw new ItmNotFoundException("Loan application not found");
            }

            //delete custom fields
            if (applicationModel.ApplicationCustomFields.Count > 0)
            {
                foreach (var custom in applicationModel.ApplicationCustomFields)
                {
                    var customFiledObj = this.applicationCustomFieldManager.Where(t => t.Id == custom.Id).FirstOrDefault();
                    if (customFiledObj != null)
                    {
                        this.applicationCustomFieldManager.Remove(customFiledObj);
                    }
                }
            }

            //delete documents
            if (applicationModel.ApplicationDocuments.Count > 0)
            {
                foreach (var document in applicationModel.ApplicationDocuments)
                {
                    var documentObj = this.documentManager.Where(t => t.Id == document.Id).FirstOrDefault();
                    if (documentObj != null)
                    {
                        this.documentManager.Remove(documentObj);
                    }
                }
            }

            //delete loan application data
            await this.loanApplicationManager.DeleteAsync(this.loanApplicationManager.Where(t => t.Id == id).FirstOrDefault());

            return true;
        }

        #endregion

        #region Sub Entity Methods


        /// <summary>
        /// 
        /// </summary>
        /// <param name="checklist"></param>
        /// <returns></returns>
        public bool UpdateChecklist(List<ApprovalEntityMappingChecklist> checklist)
        {
            bool result = false;
            foreach (var objchk in checklist)
            {
                var checkObj = this.loanApplicationApprovalMappingChecklistManager.Where(t => t.Id == objchk.Id).FirstOrDefault();
                if (checkObj != null)
                {
                    checkObj.IsSubmitted = objchk.IsSubmitted;
                    this.loanApplicationApprovalMappingChecklistManager.Update(checkObj);
                }
            }

            return result = true;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="applicationId"></param>
        /// <returns></returns>
        public async Task<List<ApprovalEntityMappingChecklist>> GetApprovalEntityMappingChecklistByApplicationId(long applicationId)
        {
            List<ApprovalEntityMappingChecklist> checklistApproval = null;
            long loggedInUserContactId = LoggedInUser.ContectId;
            long positionMapTypeId = 0;
            bool isEmployee = this.employeeManager.Where(t => t.ContactId == loggedInUserContactId).Any();

            if (isEmployee)
            {
                Contact contactObj = await this.contactManager.Where(t => t.Id == loggedInUserContactId)
                                                              .Include(t => t.Postion)
                                                              .FirstOrDefaultAsync();

                if (contactObj != null)
                {
                    positionMapTypeId = contactObj.Postion.CustomCategoryMapTypeOptionId.HasValue ? contactObj.Postion.CustomCategoryMapTypeOptionId.Value : 0;

                    //if position mapType == 
                    if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.CreditOfficer)
                    {
                        checklistApproval = this.loanApplicationApprovalMappingChecklistManager
                                               .Where(t => t.ApprovalEntityMapping.ApplicationId == applicationId)
                                               .Include(t => t.ApproverGroup)
                                               .ToList();

                        return checklistApproval;
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.BranchManager)
                    {
                        #region Branch Manager

                        checklistApproval = this.loanApplicationApprovalMappingChecklistManager
                                                .Where(t => t.ApprovalEntityMapping.ApplicationId == applicationId)
                                                //&& t.ApproverGroup.ApproverGroupTypeId == LoanManager.Configuration.ApproverGroupType.BranchManager)
                                                .Include(t => t.ApproverGroup)
                                                .ToList();

                        return checklistApproval;

                        #endregion
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.ClusterHead)
                    {
                        #region Cluster Head


                        checklistApproval = this.loanApplicationApprovalMappingChecklistManager
                                                        .Where(t => t.ApprovalEntityMapping.ApplicationId == applicationId)
                                                        //&& t.ApproverGroup.ApproverGroupTypeId == LoanManager.Configuration.ApproverGroupType.ClusterHead)
                                                        .Include(t => t.ApproverGroup)
                                                        .ToList();

                        return checklistApproval;


                        #endregion
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.CreditOperationHead)
                    {
                        #region Credit Operation

                        checklistApproval = this.loanApplicationApprovalMappingChecklistManager
                                                .Where(t => t.ApprovalEntityMapping.ApplicationId == applicationId)
                                                //&& t.ApproverGroup.ApproverGroupTypeId == LoanManager.Configuration.ApproverGroupType.CreditOperation)
                                                .Include(t => t.ApproverGroup)
                                                .ToList();

                        return checklistApproval;


                        #endregion
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.RiskOfficer ||
                            positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.LegalOfficer ||
                            positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.ComplianceOfficer
                        )
                    {

                        #region Risk, Legal & Compliance Operation

                        checklistApproval = this.loanApplicationApprovalMappingChecklistManager
                                                .Where(t => t.ApprovalEntityMapping.ApplicationId == applicationId)
                                                //&& t.ApproverGroup.ApproverGroupTypeId == LoanManager.Configuration.ApproverGroupType.Risk_LegalAndCompliance)
                                                .Include(t => t.ApproverGroup)
                                                .ToList();

                        return checklistApproval;


                        #endregion

                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.DCEO_DGMCEO)
                    {
                        #region Deputy CEO

                        checklistApproval = this.loanApplicationApprovalMappingChecklistManager
                                                    .Where(t => t.ApprovalEntityMapping.ApplicationId == applicationId)
                                                    //&& t.ApproverGroup.ApproverGroupTypeId == LoanManager.Configuration.ApproverGroupType.DCEO_DGM)
                                                    .Include(t => t.ApproverGroup)
                                                    .ToList();

                        return checklistApproval;

                        #endregion
                    }
                    else if (positionMapTypeId == LoanManager.Configuration.ApplicationMapType.Position.CEO)
                    {
                        #region CEO

                        checklistApproval = this.loanApplicationApprovalMappingChecklistManager
                                                    .Where(t => t.ApprovalEntityMapping.ApplicationId == applicationId)
                                                    //&& t.ApproverGroup.ApproverGroupTypeId == LoanManager.Configuration.ApproverGroupType.CEO)
                                                    .Include(t => t.ApproverGroup)
                                                    .ToList();

                        return checklistApproval;


                        #endregion
                    }

                }
            }

            checklistApproval = this.loanApplicationApprovalMappingChecklistManager
                                        .Where(t => t.ApprovalEntityMapping.ApplicationId == 0)
                                        //&& t.ApproverGroup.ApproverGroupTypeId == LoanManager.Configuration.ApproverGroupType.CreditOfficer)
                                        .Include(t => t.ApproverGroup)
                                        .ToList();

            return checklistApproval;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="applicationId"></param>
        /// <returns></returns>
        public async Task<List<NoteModel>> GetNoteByApplicationId(long applicationId, long noteTypeId)
        {
            List<NoteModel> noteModelList = new List<NoteModel>();
            var notelist = this.noteRepository.Where(t => t.EntityId == applicationId && t.NoteTypeId == noteTypeId)
                                             .Include(t => t.CreatedByContact)
                                             .Include(t => t.AssignedByEmployee).ThenInclude(t => t.Contact)
                                             .Include(t => t.AssignedToEmployee).ThenInclude(t => t.Contact)
                                             .ToList();


            foreach (var note in notelist)
            {
                var noteModel = new NoteModel();
                noteModel.Id = note.Id;
                noteModel.EntityTypeId = note.EntityTypeId;
                noteModel.EntityId = note.EntityId;
                noteModel.NoteDetail = note.NoteDetail;
                noteModel.IsPrivate = note.IsPrivate;

                if (noteTypeId == LoanManager.Configuration.NoteType.QuestionsAndAnswers)
                {
                    var assignedByName = note.AssignedByEmployee.Contact.FirstName + " " + note.AssignedByEmployee.Contact.LastName;
                    var assignedToName = note.AssignedToEmployee.Contact.FirstName + " " + note.AssignedToEmployee.Contact.LastName;
                    noteModel.CreatedBy = assignedByName;
                    noteModel.CreatedFor = assignedToName;
                }
                else
                {
                    noteModel.CreatedBy = note.CreatedByContact.FirstName + " " + note.CreatedByContact.LastName;
                }

                noteModel.NoteTypeId = note.NoteTypeId;
                noteModel.CreatedByContactId = note.CreatedByContactId;
                noteModelList.Add(noteModel);
            }

            return noteModelList;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="noteList"></param>
        /// <returns></returns>
        public bool UpdateNotelist(List<NoteModel> noteList, long noteTypeId)
        {
            bool result = false;
            foreach (var objnote in noteList)
            {
                if (objnote.Id == 0)
                {
                    Note obj = new Note();
                    obj.EntityTypeId = LoanManager.Configuration.ApplicationEntityType.Application;
                    obj.EntityId = objnote.EntityId;
                    obj.NoteDetail = objnote.NoteDetail;
                    obj.CreatedByContactId = LoggedInUser.ContectId;
                    obj.DateCreated = DateTime.Now;
                    if (noteTypeId == LoanManager.Configuration.NoteType.SystemGenerated)
                        obj.IsPrivate = true;
                    else
                        obj.IsPrivate = false;
                    obj.NoteTypeId = noteTypeId;
                    this.noteRepository.Create(obj);
                }
                else
                {
                    var noteObj = this.noteRepository.Where(t => t.Id == objnote.Id).FirstOrDefault();
                    if (noteObj != null)
                    {
                        if (!noteObj.IsPrivate)
                        {
                            noteObj.NoteDetail = objnote.NoteDetail;
                            this.noteRepository.Update(noteObj);
                        }
                    }
                }
            }

            return result = true;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="applicationId"></param>
        /// <param name="models"></param>
        /// <returns></returns>
        public bool UploadDocument(long applicationId, List<AttachedFileModel> models)
        {
            bool result = false;
            foreach (var fileModel in models)
            {
                Document doc = new Document();
                doc.Title = fileModel.Title;
                doc.Description = fileModel.Description;
                doc.FileName = fileModel.FileName;
                doc.OrginalFileName = fileModel.OrginalFileName;
                doc.OrginalFile = this.photoService.GetDocumentByte(fileModel.OrginalFileName);
                doc.DateAdded = DateTime.Now;
                doc.FileSize = fileModel.FileSize;
                doc.ApplicationId = applicationId;
                doc.FileExtension = fileModel.FileExtension;
                doc.MimeType = fileModel.MimeType;
                doc.DocumentCategoryId = fileModel.DocumentCategoryId;
                this.documentManager.Create(doc);
            }

            return result = true;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="applicationId"></param>
        /// <returns></returns>
        public async Task<List<AttachedFileModel>> GetDocumentsByApplicationId(long applicationId)
        {
            List<AttachedFileModel> attachedModelList = new List<AttachedFileModel>();
            List<Document> documentList = (from doc in this.documentManager.GetAll().Include(t=>t.DocumentCategory)
                                           where doc.ApplicationId == applicationId
                                           select new Document
                                           {
                                               Id = doc.Id,
                                               Title = doc.Title,
                                               Description = doc.Description,
                                               DateAdded = doc.DateAdded,
                                               FileSize = doc.FileSize,
                                               FileName = doc.FileName,
                                               DocumentCategory = doc.DocumentCategory
                                           }).ToList();

            foreach (var doc in documentList)
            {
                var fileModel = new AttachedFileModel();
                fileModel.Id = doc.Id;
                fileModel.Title = doc.Title;
                fileModel.Description = doc.Description;
                fileModel.FormatDate = doc.DateAdded.ToString("dddd, dd MMMM yyyy");
                fileModel.FileSize = doc.FileSize;
                fileModel.FileName = doc.FileName;
                fileModel.DocumentCategoryName = doc.DocumentCategory.Name;
                attachedModelList.Add(fileModel);
            }

            return attachedModelList;
        }

        /// <summary>
        /// Get document category by application id
        /// </summary>
        /// <param name="applicationId"></param>
        /// <returns></returns>
        public async Task<List<SelectModel>> GetDocumentCategoryByApplicationId(long applicationId)
        {
            List<SelectModel> list = new List<SelectModel>();

            if (applicationId > 0)
            { 
                long loanTypeId = this.loanApplicationManager.Where(t => t.Id == applicationId).FirstOrDefault()
                                      .LoanTypeId.Value;

                List<long> ids = this.loanDocumentRepository.Where(t => t.LoanTypeId == loanTypeId)
                                     .Select(t => t.CategoryTypeId).ToList();

                var query = this.customCategoryRepository
                                .Where(t => t.CustomCategoryTypeId == LoanManager.Configuration.ApplicationCustomCategory.DocumentCategoryType
                                            && ids.Contains(t.Id))
                                .OrderBy(t => t.DisplayOrder)
                                .Select(t => new SelectModel
                                {
                                    Id = t.Id,
                                    Name = t.Name,
                                    IsDefault = t.IsDefault
                                }).ToList();

                list = query;
                //return await Task.Run(() =>
            }

            return list;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="documentId"></param>
        /// <returns></returns>
        public async Task<DownloadFileModel> DownloadFileAsync(long documentId)
        {
            if (documentId < 1)
            {
                throw new ItmArgumentMissingException("Invalid file");
            }

            Document document = await this.documentManager.Where(x => x.Id == documentId).FirstOrDefaultAsync();


            if (document == null)
            {
                throw new ItmNotFoundException("File not found");
            }

            return new DownloadFileModel
            {
                File = document.OrginalFile,
                MimeType = document.MimeType,
                FileName = document.FileName + document.FileExtension
            };
        }

        /// <summary>
        /// Delete Loan document
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<bool> DeleteLoanDocumentAsync(long id)
        {
            if (id < 1 || !await documentManager.ExistsAsync(x => x.Id == id))
            {
                throw new ItmArgumentMissingException("Document not found");
            }

            //delete loan document data
            await this.documentManager.DeleteAsync(this.documentManager.Where(t => t.Id == id).FirstOrDefault());

            return true;
        }

        /// <summary>
        /// Delete Loan document
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<bool> DeleteLoanNotesAsync(long id)
        {
            if (id < 1 || !await noteRepository.ExistsAsync(x => x.Id == id))
            {
                throw new ItmArgumentMissingException("Note not found");
            }

            //delete loan note data
            await this.noteRepository.DeleteAsync(this.noteRepository.Where(t => t.Id == id).FirstOrDefault());

            return true;
        }

        #endregion

        #region Combobox/Custom List Load Methods

        /// <summary>
        /// 
        /// </summary>
        /// <param name="applicationId"></param>
        /// <returns></returns>
        public async Task<List<ApproverGroup>> GetApprovalGroupByApplicationId(long applicationId)
        {
            List<ApproverGroup> approverGroup = null;

            approverGroup = this.loanApplicationApprovalMappingChecklistManager
                                                .Where(t => t.ApprovalEntityMapping.ApplicationId == applicationId)
                                                .Include(t => t.ApproverGroup)
                                                .Select(t => t.ApproverGroup)
                                                .Distinct()
                                                .ToList();

            return approverGroup;
        }

        #endregion

        #region Approval Related Methods

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="loanTypeId"></param>
        /// <returns></returns>
        public async Task<long> MapLoanApplicationToApprovalProcessAsync(long id, long loanTypeId)
        {
            long approvalProcessId = 0;
            long currentApproverGroupId = 0;
            int i = 1;
            long mailApproverGroupId = 0;

            var objLoanType = this.loanTypeRepository.Where(t => t.Id == loanTypeId).Include(t => t.LoanTypeApprovalProcesses).FirstOrDefault();

            if (objLoanType.LoanTypeApprovalProcesses.FirstOrDefault() != null)
                approvalProcessId = objLoanType.LoanTypeApprovalProcesses.FirstOrDefault().ApprovalProcessId;

            if (id > 0)
            {
                List<long> ids = this.loanDocumentRepository.Where(t => t.LoanTypeId == objLoanType.Id).Select(t=>t.CategoryTypeId).ToList();
                if (ids.Count > 0)
                {
                    List<long> docCategoryId = this.documentManager.Where(t => t.ApplicationId == id).Select(t => t.DocumentCategoryId).ToList();
                    List<long> items = ids.Except(docCategoryId).ToList();

                    if(items.Count > 0)
                        throw new ItmArgumentMissingException("Please upload all document category documents before send application for approval.");
                }

                LoanApplication loanApplication = await loanApplicationManager.Where(t => t.Id == id)
                                                                              .FirstOrDefaultAsync();


                if (loanApplication != null && approvalProcessId > 0)
                {
                    List<ApprovalProcessStep> approvalProcessStepList = this.approvalProcessStepRepository.Where(t => t.ApprovalProcessId == approvalProcessId)
                                                                                                          .Include(t => t.ApproverGroup)
                                                                                                          .OrderBy(t => t.SortOrder).ToList();

                    foreach (var appStepObj in approvalProcessStepList)
                    {
                        ApprovalEntityMapping objMapping = new ApprovalEntityMapping();
                        objMapping.EntityType = LoanManager.Configuration.ApplicationEntityType.Application;
                        objMapping.ApprovalProcessId = approvalProcessId;
                        objMapping.ApprovalProcessStepId = appStepObj.Id;
                        objMapping.EntityName = "Application";
                        objMapping.Description = "Application";
                        objMapping.ApproverGroupId = appStepObj.ApproverGroupId;
                        currentApproverGroupId = appStepObj.ApproverGroupId;

                        if (approvalProcessStepList.Where(t => t.SortOrder == appStepObj.SortOrder + 1).FirstOrDefault() != null)
                            objMapping.NextApproverGroupId = approvalProcessStepList.Where(t => t.SortOrder == appStepObj.SortOrder + 1).FirstOrDefault().ApproverGroupId;


                        //var statusApproval = this.customCategoryRepository
                        //       .Where(t => t.CustomCategoryTypeId == ApplicationCustomCategory.ApprovalStatusType
                        //       && t.CustomCategoryMapTypeOptionId == ApplicationMapType.ApprovalStatusType.NotStarted)
                        //       .FirstOrDefault();

                        //if (statusApproval != null)
                        if (i == 1)
                        {
                            objMapping.StatusId = LoanManager.Configuration.ApprovalStatus.InProgress;
                            mailApproverGroupId = appStepObj.ApproverGroupId;

                            var objApproverGrpMember = this.approverGroupMemberMappingManager.Where(t => t.ApprovalGroupId == appStepObj.ApproverGroupId).FirstOrDefault();
                            if (objApproverGrpMember != null)
                            {
                                loanApplication.CurrentAssignedEmployeeId = objApproverGrpMember.EmployeeId;
                            }

                        }
                        else
                            objMapping.StatusId = LoanManager.Configuration.ApprovalStatus.NotStarted;

                        objMapping.ApprovalSortOrder = appStepObj.SortOrder.Value;
                        objMapping.NoOfRequestedApproval = 1;
                        objMapping.IsFinalApproved = appStepObj.IsFinalStep;


                        //approval process step checklist
                        List<ApprovalProcessStepChecklist> approvalProcessStepChecklistList = this.approvalProcessStepChecklistRepository
                                                                                                  .Where(t => t.ApprovalProcessStepId == appStepObj.Id)
                                                                                                  .Include(t => t.ApprovalProcessStep)
                                                                                                  .Include(t => t.DocumentChecklist)
                                                                                                  .ToList();

                        foreach (var documentChecklist in approvalProcessStepChecklistList)
                        {
                            ApprovalEntityMappingChecklist mappingChecklist = new ApprovalEntityMappingChecklist();
                            mappingChecklist.ApprovalProcessStepChecklistId = documentChecklist.Id;
                            mappingChecklist.ApproverGroupId = documentChecklist.ApprovalProcessStep.ApproverGroupId;
                            mappingChecklist.Title = documentChecklist.DocumentChecklist.Title;
                            objMapping.ApprovalEntityMappingChecklists.Add(mappingChecklist);
                        }

                        loanApplication.ApprovalEntityMappings.Add(objMapping);

                        if (currentApproverGroupId > 0)
                        {
                            loanApplication.ApproverCurrentGroupId = currentApproverGroupId;

                        }

                        if (loanApplication.ApprovalEntityMappings.Count > 0)
                        {
                            loanApplication.ApplicationStatusId = this.GetDefaultCustomCategoryIdByMapTypeId(LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.InProgress);
                            await loanApplicationManager.UpdateAsync(loanApplication);
                        }

                        i++;
                    }

                    this.SendApproverGroupMail(mailApproverGroupId, loanApplication.ApplicationId);
                }
            }

            return id;
        }

        /// <summary>
        /// Reject approval request
        /// </summary>
        /// <param name="mappingTableRecordid"></param>
        /// <param name="bnessEntity"></param>
        /// <param name="entityId"></param>
        /// <param name="appPrssId"></param>
        /// <param name="appProssStpId"></param>
        /// <param name="appGroupId"></param>
        /// <param name="bnessProId"></param>
        public bool RejectRequest(long entityId, long mappingTableRecordid)
        {
            bool validResult = false;
            ApprovalEntityMapping objAppEntityMap = null;
            if (mappingTableRecordid > 0)
            {
                //entity mapping update
                objAppEntityMap = this.loanApplicationApprovalMappingManager.Where(t => t.Id == mappingTableRecordid).FirstOrDefault();
                if (objAppEntityMap != null)
                {
                    var objAppEntityMappinglst = this.loanApplicationApprovalMappingManager
                                                     .Where(t => t.ApprovalProcessId == objAppEntityMap.ApprovalProcessId
                                                              && t.ApplicationId == entityId).ToList();

                    for (int i = 0; i < objAppEntityMappinglst.Count; i++)
                    {
                        var objMap = objAppEntityMappinglst[i];
                        if (objMap != objAppEntityMap)
                        {
                            objMap.StatusId = LoanManager.Configuration.ApprovalStatus.Rejected;
                            this.loanApplicationApprovalMappingManager.Update(objMap);
                        }
                    }

                    objAppEntityMap.StatusId = LoanManager.Configuration.ApprovalStatus.Rejected;
                    objAppEntityMap.Description = "Application has been rejected";
                    objAppEntityMap.LastActionDate = DateTime.UtcNow;
                    objAppEntityMap.LastActionBy = LoggedInUser.ContectId;
                    objAppEntityMap.IsSubmittedAction = true;
                    this.loanApplicationApprovalMappingManager.Update(objAppEntityMap);
                    validResult = true;

                    Note noteObj = new Note();
                    noteObj.EntityTypeId = LoanManager.Configuration.ApplicationEntityType.Application;
                    noteObj.EntityId = entityId;
                    noteObj.NoteDetail = "Rejected by " + LoggedInUser.FirstName + " " + LoggedInUser.LastName;
                    noteObj.CreatedByContactId = LoggedInUser.ContectId;
                    noteObj.DateCreated = DateTime.Now;
                    noteObj.IsPrivate = true;
                    this.noteRepository.Create(noteObj);
                }
            }
            else
            {
                var objAppEntityMappinglst = this.loanApplicationApprovalMappingManager.Where(t => t.ApplicationId == entityId).ToList();
                for (int i = 0; i < objAppEntityMappinglst.Count; i++)
                {
                    var objMap = objAppEntityMappinglst[i];
                    objMap.StatusId = LoanManager.Configuration.ApprovalStatus.Rejected;
                    this.loanApplicationApprovalMappingManager.Update(objMap);
                }

                validResult = true;
            }

            if (validResult)
            {
                //Update entity status.
                LoanApplication loanApplication = loanApplicationManager.Where(t => t.Id == entityId).FirstOrDefault();
                if (loanApplication != null)
                {
                    loanApplication.ApplicationStatusId = this.GetDefaultCustomCategoryIdByMapTypeId(LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.Rejected);
                    loanApplicationManager.Update(loanApplication);
                    this.SendApplicationRejectionGroupMail(loanApplication.AssignedEmployeeId.Value, loanApplication.ApplicationId);
                }
            }

            return validResult;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="entityId"></param>
        /// <param name="mappingTableRecordid"></param>
        public async Task<bool> AcceptRequest(long entityId, long mappingTableRecordid)
        {
            bool validResult = false;
            long mailApproverGroupId = 0;
            string loanApplicationId = "";
            //entity mapping update
            ApprovalEntityMapping objAppEntityMap = this.loanApplicationApprovalMappingManager.Where(t => t.Id == mappingTableRecordid).FirstOrDefault();
            ApprovalEntityMapping objNextAppEntityMapping = null;


            if (objAppEntityMap != null)
            {
                bool hasPendingChecklist = this.loanApplicationApprovalMappingChecklistManager
                                               .Where(t => t.ApprovalEntityMappingId == mappingTableRecordid && !t.IsSubmitted).Any();

                if (hasPendingChecklist)
                {
                    throw new ItmArgumentMissingException("Please submit checklist before proceed accepted.");
                }


                objNextAppEntityMapping = this.loanApplicationApprovalMappingManager
                                              .Where(t => t.ApprovalProcessId == objAppEntityMap.ApprovalProcessId
                                                       && t.ApplicationId == entityId
                                                       && t.ApprovalSortOrder == (objAppEntityMap.ApprovalSortOrder + 1))
                                              .Include(t => t.Application)
                                              .FirstOrDefault();
                if (objNextAppEntityMapping != null)
                {
                    objNextAppEntityMapping.StatusId = LoanManager.Configuration.ApprovalStatus.InProgress;
                    mailApproverGroupId = objNextAppEntityMapping.ApproverGroupId.Value;
                    loanApplicationId = objNextAppEntityMapping.Application.ApplicationId;
                    this.loanApplicationApprovalMappingManager.Update(objNextAppEntityMapping);
                }

                objAppEntityMap.StatusId = LoanManager.Configuration.ApprovalStatus.Accepted;
                objAppEntityMap.Description = "Accepted";
                objAppEntityMap.LastActionBy = LoggedInUser.ContectId;
                objAppEntityMap.LastActionDate = DateTime.UtcNow;
                objAppEntityMap.IsSubmittedAction = true;
                this.loanApplicationApprovalMappingManager.Update(objAppEntityMap);
                this.SendApproverGroupMail(mailApproverGroupId, loanApplicationId);


                Note noteObj = new Note();
                noteObj.EntityTypeId = LoanManager.Configuration.ApplicationEntityType.Application;
                noteObj.EntityId = entityId;
                noteObj.NoteDetail = "Accepted by " + LoggedInUser.FirstName + " " + LoggedInUser.LastName;
                noteObj.CreatedByContactId = LoggedInUser.ContectId;
                noteObj.DateCreated = DateTime.Now;
                noteObj.IsPrivate = true;
                this.noteRepository.Create(noteObj);
            }

            this.UpdateEntityAfterAllApprovalAccepted(entityId, mappingTableRecordid);
            return validResult = true;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="entityId"></param>
        /// <param name="mappingTableRecordid"></param>
        public void UpdateEntityAfterAllApprovalAccepted(long entityId, long mappingTableRecordid)
        {
            long status = this.GetApprovalStatus(entityId);
            if (status == LoanManager.Configuration.ApprovalStatus.Accepted)
            {
                //Update final accept result
                var objMapp = this.loanApplicationApprovalMappingManager.Where(t => t.Id == mappingTableRecordid).FirstOrDefault();
                if (objMapp != null)
                {
                    objMapp.IsFinalApproved = true;
                    this.loanApplicationApprovalMappingManager.Update(objMapp);
                }

                //loop through previous record which final approved bit is true and entity id is same
                List<ApprovalEntityMapping> prevEntity = this.loanApplicationApprovalMappingManager
                                                             .Where(t => t.ApplicationId == entityId && t.Id != mappingTableRecordid && t.IsFinalApproved).ToList();
                for (int i = 0; i < prevEntity.Count; i++)
                {
                    var objEntity = prevEntity[i];
                    var objEntityMap = this.loanApplicationApprovalMappingManager.Where(t => t.Id == objEntity.Id).FirstOrDefault();
                    if (objEntityMap != null)
                    {
                        objEntityMap.IsFinalApproved = false;
                        this.loanApplicationApprovalMappingManager.Update(objEntityMap);
                    }
                }

                //Update entity status.
                LoanApplication loanApplication = loanApplicationManager.Where(t => t.Id == entityId).FirstOrDefault();
                if (loanApplication != null)
                {
                    loanApplication.ApplicationStatusId = this.GetDefaultCustomCategoryIdByMapTypeId(LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.Approved);
                    loanApplicationManager.Update(loanApplication);
                    this.SendApplicationAcceptanceGroupMail(loanApplication.AssignedEmployeeId.Value, loanApplication.ApplicationId);
                }


            }
        }

        /// <summary>
        /// Get approval status
        /// </summary>
        /// <param name="entityId"></param>
        /// <returns></returns>
        public long GetApprovalStatus(long entityId)
        {
            long status = LoanManager.Configuration.ApprovalStatus.NotStarted;
            Dictionary<long, long> entityStatus = new Dictionary<long, long>();

            //check entity already mapping or not
            if (this.loanApplicationApprovalMappingManager.Where(t => t.ApplicationId == entityId).Any())
            {

                var objMapplst = this.loanApplicationApprovalMappingManager.Where(t => t.ApplicationId == entityId).OrderBy(t => t.ApprovalSortOrder).ToList();
                for (int i = 0; i < objMapplst.Count; i++)
                {
                    var obj = objMapplst[i];
                    if (obj.StatusId == LoanManager.Configuration.ApprovalStatus.Rejected)
                    {
                        status = LoanManager.Configuration.ApprovalStatus.Rejected;
                        break;
                    }
                    else if (obj.StatusId == LoanManager.Configuration.ApprovalStatus.Review)
                    {
                        status = LoanManager.Configuration.ApprovalStatus.Review;
                        break;
                    }
                    else
                    {
                        entityStatus.Add(obj.Id, obj.StatusId);
                    }
                }


                //if status is rejected
                if (status != LoanManager.Configuration.ApprovalStatus.Review && status != LoanManager.Configuration.ApprovalStatus.Rejected)
                {
                    int acceptedCount = entityStatus.Where(t => t.Value == LoanManager.Configuration.ApprovalStatus.Accepted).GroupBy(t => t.Value).Count();
                    int groupCount = entityStatus.GroupBy(t => t.Value).Count();

                    //all value are same
                    if (groupCount == acceptedCount)
                    {
                        status = LoanManager.Configuration.ApprovalStatus.Accepted;
                    }
                    else
                    {
                        status = LoanManager.Configuration.ApprovalStatus.InProgress;
                    }
                }

            }

            return status;
        }

        /// <summary>
        /// submit to credit administrator
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool SubmitToCreditAdministrator(long id)
        {
            bool isValid = false;

            //Update entity status.
            LoanApplication loanApplication = loanApplicationManager.Where(t => t.Id == id).FirstOrDefault();
            if (loanApplication != null)
            {
                loanApplication.IsSubmittedToCreditAdministrator = true;
                isValid = loanApplicationManager.Update(loanApplication).IsSubmittedToCreditAdministrator;
            }

            return isValid;
        }

        #endregion

        #region Utility Methods

        /// <summary>
        /// 
        /// </summary>
        /// <param name="mapTypeId"></param>
        /// <returns></returns>
        private long GetDefaultCustomCategoryIdByMapTypeId(long mapTypeId)
        {
            //LoanManager.Configuration.ApplicationMapType.ApprovalStatusType.InProgress
            var customCategoryId = this.customCategoryRepository.Where(t => t.CustomCategoryMapTypeOptionId == mapTypeId).FirstOrDefault().Id;
            return customCategoryId;
        }

        /// <summary>
        /// GetNextApplicationID
        /// </summary>
        /// <returns></returns>
        public string GetNextApplicationID()
        {
            long maxExistingId = 0;
            var obj = this.loanApplicationManager.GetAll().FirstOrDefault();
            if (obj != null)
                maxExistingId = this.loanApplicationManager.GetAll().Select(p => p.Id).ToList().Max();

            return $"LAP-{maxExistingId + 1}";
        }


        #endregion

        #region Email Configuration Methods

        private void SendApproverGroupMail(long approverGroupId, string loanApplicationId)
        {
            //string emailStr = "";
            var objList = this.approverGroupMemberMappingManager.GetAll().Include(t => t.Employee).ThenInclude(t => t.Contact)
                               .Where(t => t.ApprovalGroupId == approverGroupId).ToList();



            //Step 1: Prepare Email from Email Template EmailHistory
            var emailTemplate = emailTemplateRepository.Where(e => e.TemplateType == (int)LoanManager.Configuration.Enums.EnumEmailTemplateType.LoanApprovalRequest).FirstOrDefault();
            if (emailTemplate != null && !string.IsNullOrEmpty(emailTemplate.TemplateSubject) && !string.IsNullOrEmpty(emailTemplate.TemplateDetail))
            {
                var emailManager = new EmailManager();

                //Prepare MailMessage
                MailMessage message = new MailMessage();

                foreach (var obj in objList)
                {
                    MailAddress resp = new MailAddress(obj.Employee.Contact.Email);
                    message.To.Add(resp);
                }


                message.Subject = emailTemplate.TemplateSubject;
                message.Priority = MailPriority.Normal;

                emailTemplate.TemplateDetail = emailTemplate.TemplateDetail.Replace(emailManager.PrepreTag("userName"), "");
                emailTemplate.TemplateDetail = emailTemplate.TemplateDetail.Replace(emailManager.PrepreTag("loanApplicationID"), loanApplicationId);

                message.Body = emailTemplate.TemplateDetail;
                message.IsBodyHtml = true;
                message.BodyEncoding = System.Text.Encoding.GetEncoding("utf-8");

                //Step 2: Send Email                
                if (emailManager.SendEmail(message))
                {
                    foreach (var objEmp in objList)
                    {

                        //Step 3: Save Email History
                        EmailHistory obj = new EmailHistory();
                        obj.EntityTypeId = LoanManager.Configuration.ApplicationEntityType.Employee;
                        obj.EntityId = objEmp.Employee.Id;
                        obj.EmailSender = emailManager.SenderEmailAddress;
                        obj.EmailReceiver = objEmp.Employee.Contact.Email;
                        obj.Subject = message.Subject;
                        obj.EmailContent = message.Body;
                        obj.CreatedByContactId = LoggedInUser.ContectId;
                        obj.DateCreated = DateTime.UtcNow;

                        this.emailHistoryRepository.Create(obj);
                    }
                }
            }


        }

        private void SendNewApplicationGroupMail(long employeeId, string loanApplicationId)
        {
            var objList = this.employeeManager.GetAll().Include(t => t.Contact)
                               .Where(t => t.Id == employeeId).ToList();


            //Step 1: Prepare Email from Email Template EmailHistory
            var emailTemplate = emailTemplateRepository.Where(e => e.TemplateType == (int)LoanManager.Configuration.Enums.EnumEmailTemplateType.NewApplication).FirstOrDefault();
            if (emailTemplate != null && !string.IsNullOrEmpty(emailTemplate.TemplateSubject) && !string.IsNullOrEmpty(emailTemplate.TemplateDetail))
            {
                var emailManager = new EmailManager();

                //Prepare MailMessage
                MailMessage message = new MailMessage();

                foreach (var obj in objList)
                {
                    MailAddress resp = new MailAddress(obj.Contact.Email);
                    message.To.Add(resp);
                }

                string fullName = "";
                if (objList.Count > 0)
                    fullName = objList[0].Contact.FirstName + " " + objList[0].Contact.LastName;

                message.Subject = emailTemplate.TemplateSubject;
                message.Priority = MailPriority.Normal;

                emailTemplate.TemplateDetail = emailTemplate.TemplateDetail.Replace(emailManager.PrepreTag("userName"), fullName);
                emailTemplate.TemplateDetail = emailTemplate.TemplateDetail.Replace(emailManager.PrepreTag("loanApplicationID"), loanApplicationId);

                message.Body = emailTemplate.TemplateDetail;
                message.IsBodyHtml = true;
                message.BodyEncoding = System.Text.Encoding.GetEncoding("utf-8");

                //Step 2: Send Email                
                if (emailManager.SendEmail(message))
                {
                    foreach (var objEmp in objList)
                    {

                        //Step 3: Save Email History
                        EmailHistory obj = new EmailHistory();
                        obj.EntityTypeId = LoanManager.Configuration.ApplicationEntityType.Employee;
                        obj.EntityId = objEmp.Id;
                        obj.EmailSender = emailManager.SenderEmailAddress;
                        obj.EmailReceiver = objEmp.Contact.Email;
                        obj.Subject = message.Subject;
                        obj.EmailContent = message.Body;
                        obj.CreatedByContactId = LoggedInUser.ContectId;
                        obj.DateCreated = DateTime.UtcNow;

                        this.emailHistoryRepository.Create(obj);
                    }
                }
            }


        }

        private void SendApplicationAcceptanceGroupMail(long employeeId, string loanApplicationId)
        {
            var objList = this.employeeManager.GetAll().Include(t => t.Contact)
                               .Where(t => t.Id == employeeId).ToList();


            //Step 1: Prepare Email from Email Template EmailHistory
            var emailTemplate = emailTemplateRepository.Where(e => e.TemplateType == (int)LoanManager.Configuration.Enums.EnumEmailTemplateType.LoanAcceptance).FirstOrDefault();
            if (emailTemplate != null && !string.IsNullOrEmpty(emailTemplate.TemplateSubject) && !string.IsNullOrEmpty(emailTemplate.TemplateDetail))
            {
                var emailManager = new EmailManager();

                //Prepare MailMessage
                MailMessage message = new MailMessage();

                foreach (var obj in objList)
                {
                    MailAddress resp = new MailAddress(obj.Contact.Email);
                    message.To.Add(resp);
                }


                string fullName = "";
                if (objList.Count > 0)
                    fullName = objList[0].Contact.FirstName + " " + objList[0].Contact.LastName;

                message.Subject = emailTemplate.TemplateSubject;
                message.Priority = MailPriority.Normal;

                emailTemplate.TemplateDetail = emailTemplate.TemplateDetail.Replace(emailManager.PrepreTag("userName"), fullName);
                emailTemplate.TemplateDetail = emailTemplate.TemplateDetail.Replace(emailManager.PrepreTag("loanApplicationID"), loanApplicationId);

                message.Body = emailTemplate.TemplateDetail;
                message.IsBodyHtml = true;
                message.BodyEncoding = System.Text.Encoding.GetEncoding("utf-8");

                //Step 2: Send Email                
                if (emailManager.SendEmail(message))
                {
                    foreach (var objEmp in objList)
                    {

                        //Step 3: Save Email History
                        EmailHistory obj = new EmailHistory();
                        obj.EntityTypeId = LoanManager.Configuration.ApplicationEntityType.Employee;
                        obj.EntityId = objEmp.Id;
                        obj.EmailSender = emailManager.SenderEmailAddress;
                        obj.EmailReceiver = objEmp.Contact.Email;
                        obj.Subject = message.Subject;
                        obj.EmailContent = message.Body;
                        obj.CreatedByContactId = LoggedInUser.ContectId;
                        obj.DateCreated = DateTime.UtcNow;

                        this.emailHistoryRepository.Create(obj);
                    }
                }
            }


        }

        private void SendApplicationRejectionGroupMail(long employeeId, string loanApplicationId)
        {
            //string emailStr = "";
            var objList = this.employeeManager.GetAll().Include(t => t.Contact)
                               .Where(t => t.Id == employeeId).ToList();



            //Step 1: Prepare Email from Email Template EmailHistory
            var emailTemplate = emailTemplateRepository.Where(e => e.TemplateType == (int)LoanManager.Configuration.Enums.EnumEmailTemplateType.LoanRejection).FirstOrDefault();
            if (emailTemplate != null && !string.IsNullOrEmpty(emailTemplate.TemplateSubject) && !string.IsNullOrEmpty(emailTemplate.TemplateDetail))
            {
                var emailManager = new EmailManager();

                //Prepare MailMessage
                MailMessage message = new MailMessage();

                foreach (var obj in objList)
                {
                    MailAddress resp = new MailAddress(obj.Contact.Email);
                    message.To.Add(resp);
                }


                string fullName = "";
                if (objList.Count > 0)
                    fullName = objList[0].Contact.FirstName + " " + objList[0].Contact.LastName;

                message.Subject = emailTemplate.TemplateSubject;
                message.Priority = MailPriority.Normal;

                emailTemplate.TemplateDetail = emailTemplate.TemplateDetail.Replace(emailManager.PrepreTag("userName"), fullName);
                emailTemplate.TemplateDetail = emailTemplate.TemplateDetail.Replace(emailManager.PrepreTag("loanApplicationID"), loanApplicationId);

                message.Body = emailTemplate.TemplateDetail;
                message.IsBodyHtml = true;
                message.BodyEncoding = System.Text.Encoding.GetEncoding("utf-8");

                //Step 2: Send Email                
                if (emailManager.SendEmail(message))
                {
                    foreach (var objEmp in objList)
                    {

                        //Step 3: Save Email History
                        EmailHistory obj = new EmailHistory();
                        obj.EntityTypeId = LoanManager.Configuration.ApplicationEntityType.Employee;
                        obj.EntityId = objEmp.Id;
                        obj.EmailSender = emailManager.SenderEmailAddress;
                        obj.EmailReceiver = objEmp.Contact.Email;
                        obj.Subject = message.Subject;
                        obj.EmailContent = message.Body;
                        obj.CreatedByContactId = LoggedInUser.ContectId;
                        obj.DateCreated = DateTime.UtcNow;

                        this.emailHistoryRepository.Create(obj);
                    }
                }
            }


        }

        private void AssignEmployeeForCommunicationWithinApprovalProcessMail(long assignedById, long assignedToId, string loanApplicationId)
        {
            //string emailStr = "";
            var objList = this.employeeManager.GetAll().Include(t => t.Contact)
                               .Where(t => t.Id == assignedToId).ToList();


            var objAssigneedBy = this.employeeManager.GetAll().Include(t => t.Contact)
                               .Where(t => t.Id == assignedById).FirstOrDefault();


            //Step 1: Prepare Email from Email Template EmailHistory
            var emailTemplate = emailTemplateRepository.Where(e => e.TemplateType == (int)LoanManager.Configuration.Enums.EnumEmailTemplateType.CommunicationLogs).FirstOrDefault();
            if (emailTemplate != null && !string.IsNullOrEmpty(emailTemplate.TemplateSubject) && !string.IsNullOrEmpty(emailTemplate.TemplateDetail))
            {
                var emailManager = new EmailManager();

                //Prepare MailMessage
                MailMessage message = new MailMessage();

                foreach (var obj in objList)
                {
                    MailAddress resp = new MailAddress(obj.Contact.Email);
                    message.To.Add(resp);
                }


                string fullName = "";
                if (objList.Count > 0)
                    fullName = objList[0].Contact.FirstName + " " + objList[0].Contact.LastName;

                message.Subject = emailTemplate.TemplateSubject;
                message.Priority = MailPriority.Normal;

                emailTemplate.TemplateDetail = emailTemplate.TemplateDetail.Replace(emailManager.PrepreTag("userName"), fullName);
                emailTemplate.TemplateDetail = emailTemplate.TemplateDetail.Replace(emailManager.PrepreTag("loanApplicationID"), loanApplicationId);

                if (objAssigneedBy != null)
                {
                    fullName = objAssigneedBy.Contact.FirstName + " " + objAssigneedBy.Contact.LastName;
                    emailTemplate.TemplateDetail = emailTemplate.TemplateDetail.Replace(emailManager.PrepreTag("assigneeName"), fullName);
                }

                message.Body = emailTemplate.TemplateDetail;
                message.IsBodyHtml = true;
                message.BodyEncoding = System.Text.Encoding.GetEncoding("utf-8");

                //Step 2: Send Email                
                if (emailManager.SendEmail(message))
                {
                    foreach (var objEmp in objList)
                    {

                        //Step 3: Save Email History
                        EmailHistory obj = new EmailHistory();
                        obj.EntityTypeId = LoanManager.Configuration.ApplicationEntityType.Employee;
                        obj.EntityId = objEmp.Id;
                        obj.EmailSender = emailManager.SenderEmailAddress;
                        obj.EmailReceiver = objEmp.Contact.Email;
                        obj.Subject = message.Subject;
                        obj.EmailContent = message.Body;
                        obj.CreatedByContactId = LoggedInUser.ContectId;
                        obj.DateCreated = DateTime.UtcNow;

                        this.emailHistoryRepository.Create(obj);
                    }
                }
            }


        }

        #endregion


        #region Assignee Settings

        public async Task<List<SelectModel>> GetApprovalProcessAssigneeAsync(long loanApplicationId)
        {
            //return await Task.Run(() => 

            //   this.loanApplicationApprovalMappingManager.Where(t => t..IsInternal).OrderBy(t => t.Name)
            //  .Select(t => new SelectModel
            //  {
            //      Id = t.Id,
            //      Name = t.Name
            //  }).ToList());

            long id = 0;
            if (loanApplicationId > 0)
            {
                id = this.loanApplicationManager.GetAll().Where(t => t.Id == loanApplicationId).FirstOrDefault().AssignedEmployeeId.Value;
            }

            var queryEmp = from emp in this.employeeManager.GetAll().Include(t => t.Contact)
                           join con in this.contactManager.GetAll() on emp.ContactId equals con.Id
                           where emp.Id == id
                           select new SelectModel
                           {
                               Id = emp.Id,
                               Name = con.FirstName + ' ' + con.LastName
                           };

            var queryLoan = from mp in this.loanApplicationApprovalMappingManager.GetAll()
                            join grp in this.approverGroupMappingManager.GetAll() on mp.ApproverGroupId equals grp.Id
                            join grpm in this.approverGroupMemberMappingManager.GetAll() on grp.Id equals grpm.ApprovalGroupId
                            join emp in this.employeeManager.GetAll().Include(t => t.Contact) on grpm.EmployeeId equals emp.Id
                            join con in this.contactManager.GetAll() on emp.ContactId equals con.Id
                            join bcat in this.businessCategoryRepository.GetAll() on mp.StatusId equals bcat.Id

                            where
                            mp.StatusId != LoanManager.Configuration.ApprovalStatus.NotStarted && mp.ApplicationId == loanApplicationId

                            select new SelectModel
                            {
                                Id = emp.Id,
                                Name = con.FirstName + ' ' + con.LastName
                            };

            var query = queryLoan.Union(queryEmp);
            return await Task.Run(() => query.Distinct().ToList());


        }

        public async Task<List<NoteModel>> GetNoteForCurrentAssigneeApplicationId(long applicationId)
        {
            List<NoteModel> noteModelList = new List<NoteModel>();
            long currentAssigneeEmployeeId = 0;
            long loggedInUserEmployeeId = 0;
            long loggedInUserContactId = LoggedInUser.ContectId;
            var empObj = this.employeeManager.Where(t => t.ContactId == loggedInUserContactId).FirstOrDefault();
            if (empObj != null)
            {
                loggedInUserEmployeeId = empObj.Id;
            }

            if (loggedInUserEmployeeId > 0)
            {

                var objApplication = this.loanApplicationManager.Where(t => t.Id == applicationId).FirstOrDefault();
                if (objApplication != null)
                {
                    currentAssigneeEmployeeId = objApplication.CurrentAssignedEmployeeId.HasValue ? objApplication.CurrentAssignedEmployeeId.Value : 0;

                    if (currentAssigneeEmployeeId > 0)
                    {

                        var notelist = this.noteRepository.Where(t => t.EntityId == applicationId
                                                                   && t.NoteTypeId == LoanManager.Configuration.NoteType.QuestionsAndAnswers
                                                                   && (t.AssignedByEmployeeId == loggedInUserEmployeeId || t.AssignedToEmployeeId == loggedInUserEmployeeId))
                                                         .Include(t => t.CreatedByContact)
                                                         .Include(t => t.AssignedByEmployee).ThenInclude(t => t.Contact).ThenInclude(t => t.Photo)
                                                         .Include(t => t.AssignedToEmployee).ThenInclude(t => t.Contact).ThenInclude(t => t.Photo)
                                                         .OrderByDescending(t => t.DateCreated)
                                                         .ToList();


                        foreach (var note in notelist)
                        {
                            var noteModel = new NoteModel();
                            if (note.AssignedByEmployee != null)
                            {
                                var assignedByName = note.AssignedByEmployee.Contact.FirstName + " " + note.AssignedByEmployee.Contact.LastName;
                                var assignedByPhotoUrl = note.AssignedByEmployee.Contact.Photo != null ? note.AssignedByEmployee.Contact.Photo.OrginalFileName : null;
                                noteModel.AssignedByPhotoUrl = assignedByPhotoUrl;
                                noteModel.CreatedBy = assignedByName;

                                if (note.AssignedByEmployeeId != loggedInUserEmployeeId)
                                {
                                    noteModel.IsAssignedToMe = true;
                                }
                            }

                            if (note.AssignedToEmployee != null)
                            {
                                var assignedToName = note.AssignedToEmployee.Contact.FirstName + " " + note.AssignedToEmployee.Contact.LastName;
                                var assignedToPhotoUrl = note.AssignedToEmployee.Contact.Photo != null ? note.AssignedToEmployee.Contact.Photo.OrginalFileName : null;
                                noteModel.CreatedFor = assignedToName;
                                noteModel.AssignedToPhotoUrl = assignedToPhotoUrl;
                            }

                            noteModel.Id = note.Id;
                            noteModel.EntityTypeId = note.EntityTypeId;
                            noteModel.EntityId = note.EntityId;
                            noteModel.NoteDetail = note.NoteDetail;
                            noteModel.ResponseDetail = note.DateCreated.ToString("dd/MM/yyyy hh:mm tt");
                            noteModel.IsPrivate = note.IsPrivate;
                            noteModel.NoteTypeId = note.NoteTypeId;
                            noteModel.CreatedByContactId = note.CreatedByContactId;
                            noteModel.IsAssignedToMe = false;

                            noteModelList.Add(noteModel);
                        }
                    }
                }
            }

            return noteModelList;
        }

        #endregion
    }
}
