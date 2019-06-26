
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
    public class LoanTypeController : BaseController
    {
        private readonly ILoanTypeService loanTypeService;
        private readonly ICustomCategoryService customCategoryService;
        private readonly IBusinessCategoryService businessCategoryService;
        private readonly ILogger logger;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="loanTypeService"></param>
        /// <param name="customCategoryService"></param>
        /// <param name="businessCategoryService"></param>
        /// <param name="loggedInUserService"></param>
        public LoanTypeController(ILogger<LoanTypeController> logger, ILoanTypeService loanTypeService, ICustomCategoryService customCategoryService, IBusinessCategoryService businessCategoryService, ILoggedInUserService loggedInUserService) : base(logger, loggedInUserService)
        {
            this.loanTypeService = loanTypeService;
            this.customCategoryService = customCategoryService;
            this.businessCategoryService = businessCategoryService;
            this.logger = logger;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("get-loan-type-list")]
        [AllowAnonymous]
        public async Task<IActionResult> GetLoanTypesAsync()
        {
            return Ok(new ResponseMessage<IQueryable>
            {
                Result = await loanTypeService.GetLoanTypes()
            });
        }
        /// <summary>
        /// Get Contacts Async
        /// </summary>
        /// <param name="loadOptions">Dev expresss data model</param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-loantypes")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDevexLoanTypesAsync(DataSourceLoadOptions loadOptions)
        {
            return Ok(new ResponseMessage<LoadResult>
            {
                Result = await loanTypeService.GetDevexLoanTypesAsynch(loadOptions)
            });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="loanTypeId"></param>
        /// <param name="loadOptions"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-customfields-loantype/{loanTypeId}")]
        [AllowAnonymous]
        //[ActionAuthorize(1)]
        public async Task<IActionResult> GetDevexLaonTypeCustomFieldsAsync(long loanTypeId, DataSourceLoadOptions loadOptions)
        {
            return Ok(new ResponseMessage<LoadResult> { Result = await loanTypeService.GetDevexLoanTypeCustomFieldsAsync(loanTypeId, loadOptions) });
        }
        /// <summary>
        /// Get Contact Async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-loantyle-detail")]
        [AllowAnonymous]
        public async Task<IActionResult> GetLoanTypeAsync(long id)
        {
            ResponseMessage<LoanTypeViewModel> response = new ResponseMessage<LoanTypeViewModel>
            {
                Result = new LoanTypeViewModel()
            };

            response.Result.LoanTypeModel = await loanTypeService.GetEntityAsync(id);
            response.Result.CustomFieldControlTypeSelectItems = businessCategoryService.GetBusinessCategoryByType(ApplicationBusinessCategoryType.ControlType);
            response.Result.ApprovalProcessTypeSelectItems = loanTypeService.GetApprovalProcessAsync();
            response.Result.CustomFieldGroupSelectItems = loanTypeService.GetCustomFieldGroups(id);
            response.Result.DocumentCategoryTypeSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.DocumentCategoryType).Result;

            return Ok(response);

        }

        /// <summary>
        /// Get Contact Async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-custom-fields-by-loantype/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCustomFieldsByLoanTypeAsync(long id)
        {
            //ResponseMessage<LoanTypeViewModel> response = new ResponseMessage<LoanTypeViewModel>
            //{
            //    Result = new LoanTypeViewModel()
            //};

            //response.Result.LoanTypeModel = await loanTypeService.GetEntityAsync(id);
            //response.Result.CustomFieldControlTypeSelectItems = businessCategoryService.GetBusinessCategoryByType(ApplicationBusinessCategoryType.ControlType);
            //response.Result.ApprovalProcessTypeSelectItems = loanTypeService.GetApprovalProcessAsync();
            //response.Result.CustomFieldGroupSelectItems = loanTypeService.GetCustomFieldGroups(id);

            //return Ok(loanTypeService.GetCustomFieldsByLoanId(id));

            ResponseMessage<List<CustomFieldModel>> response = new ResponseMessage<List<CustomFieldModel>>
            {
                Result = loanTypeService.GetCustomFieldsByLoanId(id)
            };

            return Ok(response);
        }

        //List<CustomFieldMaster> GetCustomFieldsByLoanId(long loanTypeId);

        /// <summary>
        /// Get custom field by id Async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-custom-field-detail/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCustomFieldByIdAsync(long id)
        {
            ResponseMessage<CustomFieldModel> response = new ResponseMessage<CustomFieldModel>
            {
                Result = loanTypeService.GetCustomFieldModelById(id)
            };

            return Ok(response);

        }

        /// <summary>
        /// Create contact
        /// </summary>
        /// <param name="loanType"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("create-loantype")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> CreateLoanType([FromBody] LoanTypeModel loanType)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await loanTypeService.SaveEntityAsync(loanType);
            return Ok(response);
        }

        /// <summary>
        /// update contact
        /// </summary>
        /// <param name="id"></param>
        /// <param name="loanType"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("update-loantype")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateLoanType([FromBody] LoanTypeModel loanType)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await loanTypeService.SaveEntityAsync(loanType);
            return Ok(response);
        }
        /// <summary>
        /// delete contacts by id list
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("delete-loantype/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteLoanTypeAsync(long id)
        {
            return Ok(await loanTypeService.DeleteEntityAsync(id));
        }

        /// <summary>
        /// delete contacts by id list
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("delete-loantypes")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteLoanTypesAsync([FromBody]List<long> ids)
        {
            return Ok(await loanTypeService.DeleteEntitiesAsync(ids));
        }



        /// <summary>
        /// Create contact
        /// </summary>
        /// <param name="loanType"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("create-loantype-custom-field")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> CreateLoanTypeCustomField([FromBody] LoanTypeModel loanType)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await loanTypeService.SaveCustomFieldAsync(loanType);
            return Ok(response);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="loanType"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("update-custom-field")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateCustomFieldByLoanModel([FromBody] LoanTypeModel loanType)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await loanTypeService.UpdateCustomFieldAsync(loanType);
            return Ok(response);
        }

        /// <summary>
        /// Update Group or Field Order
        /// </summary>
        /// <param name="loanTypeId"></param>
        /// <param name="groupName"></param>
        /// <param name="controlId"></param>
        /// <param name="isDown"></param>
        /// <param name="isGroupSort"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("update-group-or-field-order/{loanTypeId}/{groupName}/{controlId}/{isDown}/{isGroupSort}")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateGroupOrFieldOrder(long loanTypeId, string groupName, long controlId, bool isDown, bool isGroupSort)
        {
            ResponseMessage<bool> response = new ResponseMessage<bool>();
            response.Result = await loanTypeService.UpdateGroupOrFieldOrder(loanTypeId, groupName, controlId, isDown, isGroupSort);

            return Ok(response);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="loanType"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("update-group")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateGroupByLoanModel([FromBody] LoanTypeModel loanType)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await loanTypeService.UpdateGroup(loanType);
            return Ok(response);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("delete-custom-field/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteLoanTypeCustomFieldDetailAsync(int id)
        {
            return Ok(await loanTypeService.DeleteCustomFieldEntityAsync(id));
        }
    }
}
