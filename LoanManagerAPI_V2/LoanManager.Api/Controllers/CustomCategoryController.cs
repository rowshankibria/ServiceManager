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
    [Route("api/system-settings/custom-categories")]
    public class CustomCategoryController : BaseController
    {
        private readonly ICustomCategoryService customCategoryService;        
        private readonly ILogger logger;

        public CustomCategoryController(ILogger<CustomCategoryController> logger, ICustomCategoryService customCategoryService, ILoggedInUserService loggedInUserService) : base(logger, loggedInUserService)
        {
            this.customCategoryService = customCategoryService;
            
            this.logger = logger;
        }


        [HttpGet]
        [Route("get-custom-categories-types")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTypesAndCategoriesTypesAsync()
        {
            ResponseMessage<CustomCategoryModuleViewModel> response = new ResponseMessage<CustomCategoryModuleViewModel>();
            response.Result = new CustomCategoryModuleViewModel
            {
                CustomCategoryModules = await customCategoryService.GetCustomCategoryModuleListAsync()
            };

            return Ok(response);
        }

        [HttpGet]
        [Route("get-custom-category-list/{routingKey}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTypeAndCategoryList(string routingKey, DataSourceLoadOptions loadOptions)
        {
            return Ok(new ResponseMessage<LoadResult> { Result = await customCategoryService.GetCustomCategoryListByRoutingKeyAsync(routingKey, loadOptions) });
        }


        [HttpGet]
        [Route("get-custom-category-type-by-key/{routingKey}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTypeAndCategoryTypeByRoutingKey(string routingKey)
        {
            return Ok(new ResponseMessage<CustomCategoryTypeModel> { Result = await customCategoryService.GetCustomCategoryTypeByRoutingKeyAsync(routingKey) });
        }

        [HttpGet]
        [Route("get-custom-category")]
        public async Task<IActionResult> GetCustomCategoryAsync(int id, string routingKey)
        {
            ResponseMessage<CustomCategoryViewModel> response = new ResponseMessage<CustomCategoryViewModel>();
            response.Result = await Task.Run(()=> new CustomCategoryViewModel
            {
                CustomCategory = customCategoryService.GetCustomCategoryByIdAsync(id).Result,                
                CustomCategoryType = customCategoryService.GetCustomCategoryTypeByRoutingKeyAsync(routingKey).Result,
                MapTypeSelectItems = customCategoryService.GetMapTypeSelectListAsync(routingKey).Result
            });

            if (id == 0)
            {
                response.Result.CustomCategory.CustomCategoryTypeId = response.Result.CustomCategoryType.Id;
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("create-custom-category")]
        [ModelValidation]
        public async Task<IActionResult> CreateCustomCategoryAsync([FromBody] CustomCategoryModel model)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await customCategoryService.SaveCustomCategoryAsync(0, model);
            return Ok(response);
        }

        [HttpPut]
        [Route("update-custom-category/{id:int}")]
        [ModelValidation]
        public async Task<IActionResult> UpdateCustomCategoryAsync(long id, [FromBody] CustomCategoryModel model)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await customCategoryService.SaveCustomCategoryAsync(id, model);
            return Ok(response);
        }

        [HttpDelete]
        [Route("delete-custom-category/{id:int}")]
        public async Task<IActionResult> DeleteCustomCategoryAsync(long id)
        {
            return Ok(await customCategoryService.DeleteEntityAsync(id));
        }

        [HttpPost]
        [Route("delete-custom-categories")]        
        public async Task<IActionResult> DeleteCustomCategoriesAsync([FromBody] List<long> ids)
        {
            return Ok(await customCategoryService.DeleteEntitiesAsync(ids));
        }

        [HttpGet]
        [Route("move-up/{id:int}")]
        [ModelValidation]
        public async Task<IActionResult> MoveUpCategoriesAsync(int id)
        {
            return Ok(await customCategoryService.MoveUpCategoriesAsync(id));
        }
        [HttpGet]
        [Route("move-down/{id:int}")]
        [ModelValidation]
        public async Task<IActionResult> MoveDownCategoriesAsync(int id)
        {
            return Ok(await customCategoryService.MoveDownCategoriesAsync(id));
        }
    }
}
