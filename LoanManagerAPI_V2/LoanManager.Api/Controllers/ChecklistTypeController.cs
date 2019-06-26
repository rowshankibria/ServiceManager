
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
    public class ChecklistTypeController : BaseController
    {
        private readonly IChecklistTypeService checklistTypeService;        
        private readonly ILogger logger;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="checklistTypeService"></param>
        /// <param name="loggedInUserService"></param>
        public ChecklistTypeController(ILogger<ChecklistTypeController> logger,
            IChecklistTypeService checklistTypeService,
            ILoggedInUserService loggedInUserService) : base(logger, loggedInUserService)
        {
            this.checklistTypeService = checklistTypeService;            
            this.logger = logger;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("get-checklist-list")]
        [AllowAnonymous]
        public async Task<IActionResult> GetChecklistTypesAsync()
        {
            return Ok(new ResponseMessage<IQueryable>
            {
                Result = await checklistTypeService.GetChecklistTypes()
            });
        }
        /// <summary>
        /// Get Contacts Async
        /// </summary>
        /// <param name="loadOptions">Dev expresss data model</param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-checklist-type")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDevexChecklistTypesAsync(DataSourceLoadOptions loadOptions)
        {
            return Ok(new ResponseMessage<LoadResult>
            {
                Result = await checklistTypeService.GetDevexChecklistTypesAsynch(loadOptions)
            });
        }
      
        /// <summary>
        /// Get Contact Async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-checklist-detail")]
        [AllowAnonymous]
        public async Task<IActionResult> GetLoanTypeAsync(long id)
        {
            ResponseMessage<ChecklistTypeViewModel> response = new ResponseMessage<ChecklistTypeViewModel>
            {
                Result = new ChecklistTypeViewModel()
            };

            response.Result.DocumentChecklistModel = await checklistTypeService.GetEntityAsync(id);
            
            return Ok(response);

        }
        /// <summary>
        /// Create contact
        /// </summary>
        /// <param name="checklistType"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("create-checklisttype")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> CreateChecklistType([FromBody] DocumentChecklistModel checklistType)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await checklistTypeService.SaveEntityAsync(checklistType);
            return Ok(response);
        }
       
        /// <summary>
        /// update contact
        /// </summary>
        /// <param name="id"></param>
        /// <param name="checklistType"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("update-checklisttype")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateLoanType([FromBody] DocumentChecklistModel checklistType)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await checklistTypeService.SaveEntityAsync(checklistType);
            return Ok(response);
        }
        /// <summary>
        /// delete contacts by id list
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("delete-checklisttype/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteChecklistTypeAsync(long id)
        {
            return Ok(await checklistTypeService.DeleteEntityAsync(id));
        }

        /// <summary>
        /// delete contacts by id list
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("delete-checklisttypes")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteChecklistTypesAsync([FromBody]List<long> ids)
        {
            return Ok(await checklistTypeService.DeleteEntitiesAsync(ids));
        }
    }
}
