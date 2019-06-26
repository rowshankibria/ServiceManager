
using LoanManager.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Linq;
using LoanManager.Shared;
using LoanManager.Api.Providers;
using LoanManager.ApplicationService;
using LoanManager.ApplicationService.Models;
using LoanManager.Configuration;
using DevExtreme.AspNet.Data.ResponseModel;
using LoanManager.Data;
using LoanManager.Data.StoredProcedureModel;
using LoanManager.Data.Models;
using Microsoft.AspNetCore.Hosting.Internal;
using Microsoft.AspNetCore.Http;

namespace LoanManager.Api.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    [Route("api/loan/loanApplication")]
    public class LoanApplicationController : BaseController
    {
        private readonly ILoanApplicationService loanApplicationService;
        private readonly ICustomCategoryService customCategoryService;
        private readonly ILogger logger;
        private readonly ISharedService sharedService;
        private readonly IContactService contactService;
        private readonly IStoredProcedureRepository storedProcedureService;
        private readonly IApproverGroupService approverGroupService;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="contactService"></param>
        /// <param name="loanApplicationService"></param>
        /// <param name="customCategoryService"></param>
        /// <param name="sharedService"></param>
        /// <param name="loggedInUserService"></param>
        public LoanApplicationController(ILogger<LoanApplicationController> logger, 
            IStoredProcedureRepository storedProcedureService, 
            IContactService contactService, 
            ILoanApplicationService loanApplicationService, 
            ICustomCategoryService customCategoryService, 
            ISharedService sharedService, 
            ILoggedInUserService loggedInUserService,
            IApproverGroupService approverGroupService) : base(logger, loggedInUserService)
        {
            this.storedProcedureService = storedProcedureService;
            this.loanApplicationService = loanApplicationService;
            this.customCategoryService = customCategoryService;
            this.sharedService = sharedService;
            this.logger = logger;
            this.contactService = contactService;
            this.approverGroupService = approverGroupService;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-application-list-by-contact/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetLoanApplicationByContactAsync(long id)
        {
            return Ok(await loanApplicationService.GetActiveLoanApplicationsAsync(id));
        }
        /// <summary>
        /// Get applications Async
        /// </summary>
        /// <param name="loadOptions">Dev expresss data model</param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-loanapplications")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDevexLoanApplicationsAsync(DataSourceLoadOptions loadOptions)
        {
            return Ok(new ResponseMessage<LoadResult>
            {
                Result = await loanApplicationService.GetDevexActiveLoanApplicationsAsync(loadOptions)
            });
        }
        /// <summary>
        /// Get applications Async
        /// </summary>
        /// <param name="loadOptions">Dev expresss data model</param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-submit-loanapplications")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDevexSubmitLoanApplicationsAsync(DataSourceLoadOptions loadOptions)
        {
            return Ok(new ResponseMessage<LoadResult>
            {
                Result = await loanApplicationService.GetDevexSubmittedLoanApplicationsAsync(loadOptions)
            });
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-application-detail")]
        [AllowAnonymous]
        public async Task<IActionResult> GetApplicationDetailAsync(long id)
        {
            //return Ok(new ResponseMessage<LoanApplicationViewModel>
            //{
            //    Result = new LoanApplicationViewModel
            //    {
            //        ImTypeSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.IMType).Result,
            //        CompanySelectItems = await sharedService.GetCompanySelectItemsAsync(),
            //        TitleSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.TitleType).Result,
            //        PositionSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.PositionType).Result,
            //        TimezoneSelectItems = sharedService.GetTimeZoneSelectItemsAsync().Result,
            //        SkillsSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.SkillType).Result,
            //        GenderSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.GenderType).Result,
            //        PreferredContactMethodSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.PreferredContactMethod).Result,
            //        PreferredPhoneTypeSelectItems = contactService.GetPreferredPhoneTypeSelectedItem(),
            //        ApplicationStatusTypeSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.ApprovalStatusType).Result,
            //        LoanTypeSelectItems = await sharedService.GetLoanTypeSelectItemsAsync(),
            //        BranchSelectItems = await sharedService.GetBranchSelectItemsAsync(),
            //        EmployeeSelectItems = approverGroupService.GetCreditOfficerEmployeeItemsAsync(),

            //        LoanApplicationModel = await loanApplicationService.GetLoanApplicationByIdAsync(id),
            //    }
                
            //});


            LoanApplicationViewModel result = new LoanApplicationViewModel
            {
                LoanApplicationModel = await loanApplicationService.GetLoanApplicationByIdAsync(id)
            };

            result.ImTypeSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.IMType).Result;
            result.CompanySelectItems = await sharedService.GetCompanySelectItemsAsync();
            result.TitleSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.TitleType).Result;
            result.PositionSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.PositionType).Result;
            result.TimezoneSelectItems = sharedService.GetTimeZoneSelectItemsAsync().Result;
            result.SkillsSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.SkillType).Result;
            result.GenderSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.GenderType).Result;
            result.PreferredContactMethodSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.PreferredContactMethod).Result;
            result.PreferredPhoneTypeSelectItems = contactService.GetPreferredPhoneTypeSelectedItem();
            result.ApplicationStatusTypeSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.ApprovalStatusType).Result;
            result.LoanTypeSelectItems = await sharedService.GetLoanTypeSelectItemsAsync();
            result.BranchSelectItems = await sharedService.GetBranchSelectItemsAsync();
            result.EmployeeSelectItems = approverGroupService.GetCreditOfficerEmployeeItemsAsync();

            if (id > 0)
                result.CurrentAssigneeSelectItems = await loanApplicationService.GetApprovalProcessAssigneeAsync(id);
            else
                result.CurrentAssigneeSelectItems = new List<SelectModel>();


            if (id > 0)
                result.NoteLogsCurrentAssignee = await loanApplicationService.GetNoteForCurrentAssigneeApplicationId(id);
            else
                result.NoteLogsCurrentAssignee = new List<NoteModel>();


            ResponseMessage <LoanApplicationViewModel> response = new ResponseMessage<LoanApplicationViewModel> { Result = result };
            return Ok(response);

        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-application-detail-admin")]
        [AllowAnonymous]
        public async Task<IActionResult> GetApplicationDetailForAdminAsync(long id)
        {

            LoanApplicationViewModel result = new LoanApplicationViewModel
            {
                LoanApplicationModel = await loanApplicationService.GetLoanApplicationByIdForAdminAsync(id)
            };

            result.ImTypeSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.IMType).Result;
            result.CompanySelectItems = await sharedService.GetCompanySelectItemsAsync();
            result.TitleSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.TitleType).Result;
            result.PositionSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.PositionType).Result;
            result.TimezoneSelectItems = sharedService.GetTimeZoneSelectItemsAsync().Result;
            result.SkillsSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.SkillType).Result;
            result.GenderSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.GenderType).Result;
            result.PreferredContactMethodSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.PreferredContactMethod).Result;
            result.PreferredPhoneTypeSelectItems = contactService.GetPreferredPhoneTypeSelectedItem();
            result.ApplicationStatusTypeSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.ApprovalStatusType).Result;
            result.LoanTypeSelectItems = await sharedService.GetLoanTypeSelectItemsAsync();
            result.BranchSelectItems = await sharedService.GetBranchSelectItemsAsync();
            result.EmployeeSelectItems = approverGroupService.GetCreditOfficerEmployeeItemsAsync();

            if (id > 0)
                result.CurrentAssigneeSelectItems = await loanApplicationService.GetApprovalProcessAssigneeAsync(id);
            else
                result.CurrentAssigneeSelectItems = new List<SelectModel>();


            if (id > 0)
                result.NoteLogsCurrentAssignee = await loanApplicationService.GetNoteForCurrentAssigneeApplicationId(id);
            else
                result.NoteLogsCurrentAssignee = new List<NoteModel>();


            ResponseMessage<LoanApplicationViewModel> response = new ResponseMessage<LoanApplicationViewModel> { Result = result };
            return Ok(response);
        }
        /// <summary>
        /// Get Loan Application Detail Tabs
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-application-detail-tab")]
        [AllowAnonymous]
        public async Task<IActionResult> GetApplicationDetailTabsAsync(long id)
        {
            return Ok(new ResponseMessage<TabPageViewModel>
            {
                Result = await Task.Run(() => new TabPageViewModel
                {
                    TabItems = loanApplicationService.GetEntityDetailsTabs(id),
                    EntityType = ApplicationEntityType.LoanType
                })
            });
        }

        /// <summary>
        /// Get Loan Application Detail Tabs
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-application-checklist")]
        [AllowAnonymous]
        public async Task<IActionResult> GetApplicationChecklistAsync(long id)
        {
            return Ok(new ResponseMessage<ApplicationChecklistViewModel>
            {
                Result = new ApplicationChecklistViewModel
                {
                    ApplicationChecklist = await loanApplicationService.GetApprovalEntityMappingChecklistByApplicationId(id),
                    LoanApplicationModel = await loanApplicationService.GetLoanApplicationByIdForAdminAsync(id),
                    ApproverGroupList = await loanApplicationService.GetApprovalGroupByApplicationId(id),
                }
            });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-application-user-notelist")]
        [AllowAnonymous]
        public async Task<IActionResult> GetApplicationUserNotelistAsync(long id)
        {
            return Ok(new ResponseMessage<NoteViewModel>
            {
                Result = new NoteViewModel
                {
                    NoteList = await loanApplicationService.GetNoteByApplicationId(id, LoanManager.Configuration.NoteType.UserGenerated),
                    LoanApplicationModel = await loanApplicationService.GetLoanApplicationByIdForAdminNotesAsync(id)
                }
            });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-application-system-notelist")]
        [AllowAnonymous]
        public async Task<IActionResult> GetApplicationSystemNotelistAsync(long id)
        {
            return Ok(new ResponseMessage<NoteViewModel>
            {
                Result = new NoteViewModel
                {
                    NoteList = await loanApplicationService.GetNoteByApplicationId(id, LoanManager.Configuration.NoteType.SystemGenerated)//,
                    //LoanApplicationModel = await loanApplicationService.GetLoanApplicationByIdForAdminAsync(id)
                }
            });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-application-qa-notelist")]
        [AllowAnonymous]
        public async Task<IActionResult> GetApplicationQANotelistAsync(long id)
        {
            return Ok(new ResponseMessage<NoteViewModel>
            {
                Result = new NoteViewModel
                {
                    NoteList = await loanApplicationService.GetNoteByApplicationId(id, LoanManager.Configuration.NoteType.QuestionsAndAnswers)//,
                    //LoanApplicationModel = await loanApplicationService.GetLoanApplicationByIdForAdminNotesAsync(id)
                }
            });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="application"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("create-application")]
        //[ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> CreateApplication([FromBody] LoanApplicationModel application)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await loanApplicationService.InsertLoanApplicationValuesAsync(application);
            return Ok(response);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="application"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("update-application")]
        //[ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateApplication([FromBody] LoanApplicationModel application)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await loanApplicationService.UpdateLoanApplicationValuesAsync(application);
            return Ok(response);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="application"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("update-checklist")]
        //[ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateChecklist([FromBody] List<ApprovalEntityMappingChecklist> checklist)
        {
            ResponseMessage<bool> response = new ResponseMessage<bool>();
            response.Result = loanApplicationService.UpdateChecklist(checklist);
            return Ok(response);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="application"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("update-user-notelist")]
        //[ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateUserGeneratedNotelist([FromBody] List<NoteModel> noteList)
        {
            ResponseMessage<bool> response = new ResponseMessage<bool>();
            response.Result = loanApplicationService.UpdateNotelist(noteList, LoanManager.Configuration.NoteType.UserGenerated);
            return Ok(response);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="application"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("update-system-notelist")]
        //[ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateSystemGeneratedNotelist([FromBody] List<NoteModel> noteList)
        {
            ResponseMessage<bool> response = new ResponseMessage<bool>();
            response.Result = loanApplicationService.UpdateNotelist(noteList, LoanManager.Configuration.NoteType.SystemGenerated);
            return Ok(response);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="application"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("update-qa-notelist")]
        //[ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateQANotelist([FromBody] List<NoteModel> noteList)
        {
            ResponseMessage<bool> response = new ResponseMessage<bool>();
            response.Result = loanApplicationService.UpdateNotelist(noteList, LoanManager.Configuration.NoteType.QuestionsAndAnswers);
            return Ok(response);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="application"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("mapping-application")]
        //[ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> MappingApplication([FromBody] LoanApplicationModel application)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await loanApplicationService.MapLoanApplicationToApprovalProcessAsync(application.Id, application.LoanTypeId.Value);
            return Ok(response);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="application"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("accept-application/{entityId}/{mappingTableRecordid}")]
        //[ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> AcceptApplication(long entityId, long mappingTableRecordid)
        {
            ResponseMessage<bool> response = new ResponseMessage<bool>();
            response.Result = await loanApplicationService.AcceptRequest(entityId, mappingTableRecordid);
            return Ok(response);           
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="application"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("reject-application/{entityId}/{mappingTableRecordid}")]
        //[ModelValidation]
        [AllowAnonymous]
        public IActionResult RejectApplication(long entityId, long mappingTableRecordid)
        {
            ResponseMessage<bool> response = new ResponseMessage<bool>();
            response.Result = loanApplicationService.RejectRequest(entityId, mappingTableRecordid);
            return Ok(response);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="application"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("submit-credit-admin/{applicationId}")]
        //[ModelValidation]
        [AllowAnonymous]
        public IActionResult SubmitToCreditAdministrator(long applicationId)
        {
            ResponseMessage<bool> response = new ResponseMessage<bool>();
            response.Result = loanApplicationService.SubmitToCreditAdministrator(applicationId);
            return Ok(response);
        }  

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("delete-application/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteApplicationAsync(long id)
        {
            return Ok(await loanApplicationService.DeleteLoanApplicationAsync(id));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("delete-note/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteApplicationNoteAsync(long id)
        {
            return Ok(await loanApplicationService.DeleteLoanNotesAsync(id));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("delete-document/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteApplicationDocumentAsync(long id)
        {
            return Ok(await loanApplicationService.DeleteLoanDocumentAsync(id));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("delete-applications")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteApplicationsAsync([FromBody]List<long> ids)
        {
            return Ok(await contactService.DeleteEntitiesAsync(ids));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-dashboard")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDashboardAsync()
        {
            return Ok(new ResponseMessage<DashboardViewModel>
            {
                Result = new DashboardViewModel
                {
                    ApplicationSummary = storedProcedureService.GetLoanApplicationSummary(),                    
                    BranchSummary = storedProcedureService.GetLoanApplicationBranchSummary(),
                    ApplicationTotalModel = storedProcedureService.GetLoanApplicationTotalSummary().FirstOrDefault(),
                }
            });
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="entityTypeId"></param>
        /// <param name="entityId"></param>
        /// <param name="models"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("upload-application-documents/{id}")]        
        public async Task<IActionResult> UploadApplicationDocument(long id, [FromBody] List<AttachedFileModel> models)
        {
            ResponseMessage<bool> response = new ResponseMessage<bool>
            {
                Result = loanApplicationService.UploadDocument(id, models)
            };

            return Ok(response);

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-application-documents")]
        [AllowAnonymous]
        public async Task<IActionResult> GetApplicationDocumentlistAsync(long id)
        {
            return Ok(new ResponseMessage<List<AttachedFileModel>>
            {
                Result = await loanApplicationService.GetDocumentsByApplicationId(id)
            });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-application-document-category")]
        [AllowAnonymous]
        public async Task<IActionResult> GetApplicationDocumentCategorylistAsync(long id)
        {
            return Ok(new ResponseMessage<List<SelectModel>>
            {
                Result = await loanApplicationService.GetDocumentCategoryByApplicationId(id)
            });
        }

        /// <summary>
        /// Download File By Id Async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("download-lastest-file/{id}")]        
        public async Task<IActionResult> DownloadFileByIdAsync(long id)
        {
            DownloadFileModel downloadFileModel = await loanApplicationService.DownloadFileAsync(id);
            return File(downloadFileModel.File, downloadFileModel.MimeType, downloadFileModel.FileName);
        }
    }
}
