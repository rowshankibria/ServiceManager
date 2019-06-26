using DevExtreme.AspNet.Data.ResponseModel;
using LoanManager.Api.Models;
using LoanManager.ApplicationService;
using LoanManager.ApplicationService.Models;
using LoanManager.Api.Providers;
using LoanManager.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LoanManager.Api.Controllers
{
    /// <summary>
    /// BusinessProfile Controller
    /// </summary>
    [Route("api/system-settings/business-profile")]
    public class BusinessProfileController : BaseController
    {
        private readonly IBusinessProfileService businessProfileService;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly ISharedService sharedService;

        /// <summary>
        /// Constructor BusinessProfileController 
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="businessProfileService"></param>
        /// <param name="loggedInUserService"></param>
        /// <param name="hostingEnvironment"></param>
        public BusinessProfileController(ILogger<BusinessProfileController> logger, IBusinessProfileService businessProfileService, ISharedService sharedService,
            ILoggedInUserService loggedInUserService, IHostingEnvironment hostingEnvironment) : base(logger, loggedInUserService)
        {
            this.businessProfileService = businessProfileService;
            this.sharedService = sharedService;
            this._hostingEnvironment = hostingEnvironment;
        }

        /// <summary>
        /// Get Business Profile Async
        /// </summary>
        /// <param name="loadOptions">Dev expresss data model</param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-business-profiles")]
        public async Task<IActionResult> GetBusinessProfilesAsync(DataSourceLoadOptions loadOptions)
        {
            return Ok(new ResponseMessage<LoadResult>
            {
                Result = await businessProfileService.GetBusinessProfileListAsync(loadOptions)
            });
        }

        /// <summary>
        /// Get Business Profile Details Async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-business-profile-details")]
        public async Task<IActionResult> GetBusinessProfileDetailsAsync(int id)
        {
            return Ok(new ResponseMessage<TabPageViewModel>
            {
                Result = await Task.Run(() => new TabPageViewModel
                {
                    TabItems = businessProfileService.GetBusinessProfileDetailsTabs(id),
                })
            });
        }

        /// <summary>
        /// Get Business Profile Async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-business-profile")]
        public async Task<IActionResult> GetBusinessProfileAsync(int id)
        {
            return Ok(new ResponseMessage<BusinessProfileViewModel>
            {
                Result = new BusinessProfileViewModel
                {
                    BusinessProfileModel = await businessProfileService.GetBusinessProfileAsync(id),
                    EmptyBusinessProfileModel = new BusinessProfileModel(),
                    CountrySelectItems = sharedService.GetCountrySelectItemsAsync().Result,
                }
            });
        }

        /// <summary>
        /// Update security configuration
        /// </summary>
        /// <param name="businessProfile"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("create-business-profile")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> CreateBusinessProfileCreate([FromBody] BusinessProfileModel businessProfile)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await businessProfileService.SaveBusinessProfileAsync(businessProfile);
            return Ok(response);
        }

        /// <summary>
        /// Update security configuration
        /// </summary>
        /// <param name="id"></param>
        /// <param name="businessProfile"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("update-business-profile/{id:int}")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateBusinessProfileCreate(int id, [FromBody] BusinessProfileModel businessProfile)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await businessProfileService.SaveBusinessProfileAsync(businessProfile);
            return Ok(response);
        }

        /// <summary>
        /// delete business profile
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("delete-business-profile/{id:int}")]
        public async Task<IActionResult> DeleteBusinessProfileAsync(int id)
        {
            return Ok(await businessProfileService.DeleteBusinessProfileByIdAsync(id));
        }

        /// <summary>
        /// delete business profile
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("delete-business-profiles")]
        public async Task<IActionResult> DeleteBusinessProfilesAsync([FromBody]List<long> ids)
        {
            return Ok(await businessProfileService.DeleteBusinessProfilesAsync(ids));
        }
    }
}
