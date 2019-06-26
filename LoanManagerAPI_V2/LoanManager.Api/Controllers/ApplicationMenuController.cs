using LoanManager.Api.Models;
using LoanManager.Api.Providers;
using LoanManager.ApplicationService;
using LoanManager.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace LoanManager.Api.Controllers
{
    [Route("api/application-service/application-menu")]
    public class ApplicationMenuController : BaseController
    {
        private readonly IApplicationMenuService applicationMenuService;
        private readonly ILogger logger;

        public ApplicationMenuController(ILogger<ApplicationMenuController> logger, IApplicationMenuService applicationMenuService, ILoggedInUserService loggedInUserService) : base(logger, loggedInUserService)
        {
            this.applicationMenuService = applicationMenuService;
            this.logger = logger;
        }
        /// <summary>
        /// get application menu
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("get-application-menu")]
        [AllowAnonymous]
        public async Task<IActionResult> GetApplicationMenu()
        {            
            return Ok(new ResponseMessage<ApplicationMenuViewModel>
            {
                Result = new ApplicationMenuViewModel
                {
                    ApplicationMenu = applicationMenuService.GetApplicationMenuAsync().Result,
                    ApplicationHeader = await applicationMenuService.GetApplicationHeaderAsync(),
                    IsSystemAdmin = LoggedInUser.IsSystemAdmin
                }
            });

        }
    }
}
