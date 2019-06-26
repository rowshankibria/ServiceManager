
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
    public class ApproverGroupController : BaseController
    {
        private readonly IApproverGroupService approverGroupService;
        private readonly IBusinessCategoryService businessCategoryService;
        private readonly ILogger logger;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="approverGroupService"></param>
        /// <param name="businessCategoryService"></param>
        /// <param name="loggedInUserService"></param>
        public ApproverGroupController(ILogger<ApproverGroupController> logger,
            IApproverGroupService approverGroupService,
            IBusinessCategoryService businessCategoryService,
            ILoggedInUserService loggedInUserService) : base(logger, loggedInUserService)
        {
            this.approverGroupService = approverGroupService;
            this.businessCategoryService = businessCategoryService;
            this.logger = logger;
        }

        /// <summary>
        /// Get Contacts Async
        /// </summary>
        /// <param name="loadOptions">Dev expresss data model</param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-approver-groups")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDevexApproverGroupsAsync(DataSourceLoadOptions loadOptions)
        {
            return Ok(new ResponseMessage<LoadResult>
            {
                Result = await approverGroupService.GetDevexApproverGroupsAsynch(loadOptions)
            });
        }

        /// <summary>
        /// Get Contact Async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-approver-group-detail")]
        [AllowAnonymous]
        public async Task<IActionResult> GetApproverGroupAsync(long id)
        {
            ResponseMessage<ApproverGroupViewModel> response = new ResponseMessage<ApproverGroupViewModel>
            {
                Result = new ApproverGroupViewModel()
            };

            response.Result.ApproverGroupModel = await approverGroupService.GetEntityAsync(id);
            response.Result.ApproverGroupTypeSelectItems = businessCategoryService.GetBusinessCategoryByType(ApplicationBusinessCategoryType.ApproverGroupType);

            return Ok(response);

        }
        /// <summary>
        /// Create contact
        /// </summary>
        /// <param name="loanType"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("create-approver-group")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> CreateApproverGroup([FromBody] ApproverGroupModel model)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await approverGroupService.SaveEntityAsync(model);
            return Ok(response);
        }

        /// <summary>
        /// update 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="loanType"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("update-approver-group")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateApproverGroup([FromBody] ApproverGroupModel model)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await approverGroupService.SaveEntityAsync(model);
            return Ok(response);
        }
        /// <summary>
        /// delete contacts by id list
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("delete-approver-group/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteApproverGroupAsync(long id)
        {
            return Ok(await approverGroupService.DeleteEntityAsync(id));
        }

        /// <summary>
        /// delete contacts by id list
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("delete-approver-groups")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteLoanTypesAsync([FromBody]List<long> ids)
        {
            return Ok(await approverGroupService.DeleteEntitiesAsync(ids));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="entityTypeId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-approver-group-by-entity-type/{entityTypeId}")]
        public IActionResult GetApproverMemberByEntityTypeAsync(long entityTypeId)
        {
            return Ok(approverGroupService.GetEmployeeItemsAsync(entityTypeId));
        }

    }
}
