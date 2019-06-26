
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

namespace LoanManager.Api.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    [Route("api/loan/configurations")]
    public class ApprovalProcessController : BaseController
    {
        private readonly IApprovalProcessService approvalProcessService;
        private readonly IBusinessCategoryService businessCategoryService;
        private readonly ILogger logger;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="approvalProcessService"></param>
        /// <param name="businessCategoryService"></param>
        /// <param name="loggedInUserService"></param>
        public ApprovalProcessController(ILogger<ApprovalProcessController> logger,
            IApprovalProcessService approvalProcessService,
            IBusinessCategoryService businessCategoryService,
            ILoggedInUserService loggedInUserService) : base(logger, loggedInUserService)
        {
            this.approvalProcessService = approvalProcessService;
            this.businessCategoryService = businessCategoryService;
            this.logger = logger;
        }

        /// <summary>
        /// Get Contacts Async
        /// </summary>
        /// <param name="loadOptions">Dev expresss data model</param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-approval-processes")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDevexApprovalProcessesAsync(DataSourceLoadOptions loadOptions)
        {
            return Ok(new ResponseMessage<LoadResult>
            {
                Result = await approvalProcessService.GetDevexApprovalProcessesAsynch(loadOptions)
            });
        }

        /// <summary>
        /// Get Contact Async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-approval-process-detail")]
        [AllowAnonymous]
        public async Task<IActionResult> GetApprovalProcessAsync(long id)
        {
            ResponseMessage<ApprovalProcessViewModel> response = new ResponseMessage<ApprovalProcessViewModel>
            {
                Result = new ApprovalProcessViewModel()
            };

            response.Result.ApprovalProcessModel = await approvalProcessService.GetEntityAsync(id);
            response.Result.ApproverGroupSelectItems = approvalProcessService.GetApproverGroupAsync();
            response.Result.CheckListSelectItems = approvalProcessService.GetDocumentChecklistAsync();            

            return Ok(response);

        }
        /// <summary>
        /// Create contact
        /// </summary>
        /// <param name="loanType"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("create-approval-process")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> CreateApprovalProcess([FromBody] ApprovalProcessModel model)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await approvalProcessService.SaveEntityAsync(model);
            return Ok(response);
        }

        /// <summary>
        /// Create contact
        /// </summary>
        /// <param name="loanType"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("create-approval-process-step")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> CreateApprovalProcessStep([FromBody] ApprovalProcessModel model)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await approvalProcessService.SaveApprovalStepAsync(model);
            return Ok(response);
        }

        /// <summary>
        /// update 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="loanType"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("update-approval-process")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateApprovalProcess([FromBody] ApprovalProcessModel model)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await approvalProcessService.SaveEntityAsync(model);
            return Ok(response);
        }
        /// <summary>
        /// delete contacts by id list
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("delete-approval-process/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteApprovalProcessAsync(long id)
        {
            return Ok(await approvalProcessService.DeleteEntityAsync(id));
        }

        /// <summary>
        /// delete contacts by id list
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("delete-approval-processes")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteApprovalProcessesAsync([FromBody]List<long> ids)
        {
            return Ok(await approvalProcessService.DeleteEntitiesAsync(ids));
        }

        
        /// <summary>
        /// get type and category list
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("get-approval-process-list/{approvalProcessId}")]
        public async Task<IActionResult> GetApprovalProcessList(long approvalProcessId, DataSourceLoadOptions loadOptions)
        {
            return Ok(new ResponseMessage<LoadResult> { Result = await approvalProcessService.GetApprovalProcessStepByIdAsync(approvalProcessId, loadOptions) });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("move-up/{id}")]       
        public async Task<IActionResult> MoveUpStepsAsync(long id)
        {
            return Ok(await approvalProcessService.MoveUpAsync(id));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("move-down/{id}")]      
        public async Task<IActionResult> MoveDownStepsAsync(long id)
        {
            return Ok(await approvalProcessService.MoveDownAsync(id));
        }

    }
}
