
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
using System.ComponentModel.DataAnnotations;

namespace LoanManager.Api.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    [Route("api/crm/company")]
    public class CompanyController : BaseController
    {
        private readonly ICompanyService companyService;        
        private readonly ISharedService sharedService;
        private readonly ICustomCategoryService customCategoryService;
        private readonly IBusinessCategoryService businessCategoryService;

        public CompanyController(ILogger<CompanyController> logger
            , ICompanyService companyService            
            , ILoggedInUserService loggedInUserService
            , ISharedService sharedService
            , ICustomCategoryService customCategoryService
            , IBusinessCategoryService businessCategoryService) : base(logger, loggedInUserService)
        {
            this.companyService = companyService;            
            this.sharedService = sharedService;
            this.customCategoryService = customCategoryService;
            this.businessCategoryService = businessCategoryService;
        }

        /// <summary>
        /// Get all company data
        /// </summary>
        /// <param name="loadOptions">Dev express data model</param>
        /// <returns>Devexpress data grid model</returns>
        /// <remarks>Awesomeness!</remarks>
        /// <response code="200">Product created</response>
        /// <response code="400">Product has missing/invalid values</response>
        /// <response code="500">Oops! Can't create your product right now</response>
        [HttpGet]
        [Route("get-companies")]
        //[ActionAuthorize(1)]
        public async Task<IActionResult> GetCompaniesAsync(DataSourceLoadOptions loadOptions)
        {

            return Ok(new ResponseMessage<LoadResult> { Result =  await companyService.GetCompaniesAsync(loadOptions) });
        }

        [HttpGet]
        [Route("get-company")]
        //[ActionAuthorize(2, "admin")]
        public async Task<IActionResult> GetCompanyAsync(long id)
        {
            ResponseMessage<CompanyViewModel> response = new ResponseMessage<CompanyViewModel>
            {
                Result = new CompanyViewModel()
            };

            response.Result.Company = await companyService.GetCompanyAsync(id);           
            

            return Ok(response);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="businessProfileId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-company-select-items/{businessProfileId}")]
        //[ActionAuthorize(2, "admin")]
        public async Task<IActionResult> GetCompanySelectTtemsAsync([Range(1, int.MaxValue)]long businessProfileId)
        {
            return Ok(new ResponseMessage<CompanyViewModel>
            {
                Result = new CompanyViewModel
                {
                    OrganisationTypeSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.OrganisationType).Result,
                    PreferredContactMethodSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.PreferredContactMethod).Result,
                    IndustrySelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.IndustryType).Result,
                    RatingSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.RatingType).Result
                }
            });
        }


        [HttpGet]
        [Route("get-state-by-country/{countryId}")]
        //[ActionAuthorize(2, "admin")]
        public async Task<IActionResult> GetStateByCountryAsync([Range(1, int.MaxValue)]long countryId)
        {
            return Ok(new ResponseMessage<List<SelectModel>>
            {
                Result = await sharedService.GetStateSelectItemsAsync(countryId)
            });
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("create-company")]
        [ModelValidation]
        public async Task<IActionResult> CreateCompanyAsync([FromBody] CompanyModel model)
        {
            return Ok(new ResponseMessage<long>
            {
                Result = await companyService.ModifyCompanyAsync(0, model)
            });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("update-company/{id}")]
        [ModelValidation]
        public async Task<IActionResult> UpdateCompanyAsync(long id, [FromBody] CompanyModel model)
        {
            return Ok(new ResponseMessage<long>
            {
                Result = await companyService.ModifyCompanyAsync(id, model)
            });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("delete-company/{id}")]
        public async Task<IActionResult> DeleteCompanyAsync(long id)
        {
            return Ok(await companyService.DeleteCompanyAsync(id));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("delete-companies")]
        public async Task<IActionResult> DeleteCompaniesAsync([FromBody] List<long> ids)
        {
            return Ok(await companyService.DeleteCompaniesAsync(ids));
        }

        /// <summary>
        /// Get Contact Details Tab Async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-company-details-tab/{id}")]
        public async Task<IActionResult> GetCompanyDetailsTabAsync(long id)
        {
            return Ok(new ResponseMessage<TabPageViewModel>
            {
                Result = await Task.Run(() => new TabPageViewModel
                {
                    TabItems = companyService.GetEntityDetailsTabs(id),
                    EntityType = ApplicationEntityType.Company
                })
            });
        }
    }
}
