using LoanManager.Api.Providers;
using LoanManager.ApplicationService;
using LoanManager.ApplicationService.Models;
using LoanManager.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace LoanManager.Api.Controllers
{
    [Route("api/application-service/application-page")]
    public class ApplicationPageController : BaseController
    {
        private readonly IApplicationPageService applicationPageService;
        private readonly ILogger logger;

        public ApplicationPageController(ILogger<ApplicationPageController> logger, IApplicationPageService applicationPageService, ILoggedInUserService loggedInUserService) : base(logger, loggedInUserService)
        {
            this.applicationPageService = applicationPageService;
            this.logger = logger;
        }

        /// <summary>
        /// get application page
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("get-application-list-page-by-routing-url")]
        [AllowAnonymous]
        public async Task<IActionResult> GetApplicationListPageByRoutingUrl(string routingUrl)
        {
            return Ok(new ResponseMessage<ApplicationListPageModel> { Result = await applicationPageService.GetApplicationListPageByRoutingUrlAsync(routingUrl) });
        }

        /// <summary>
        /// get application page
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("get-application-list-page-by-name")]
        [AllowAnonymous]
        public async Task<IActionResult> GetApplicationListPageByName(string name)
        {
            return Ok(new ResponseMessage<ApplicationListPageModel> { Result = await applicationPageService.GetApplicationListPageByNameAsync(name) });
        }
    }
}
