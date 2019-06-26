using LoanManager.Api.Models;
using LoanManager.Api.Providers;
using LoanManager.ApplicationService;
using LoanManager.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace Itm.Api.Controllers
{
    /// <summary>
    /// ConfigurationMenuController controller. this api is liable to provide configuration related api
    /// </summary>
    [Route("api/system-settings/configuration-menu")]
    public class ConfigurationMenuController : BaseController
    {
        private readonly ILogger logger;

        public ConfigurationMenuController(ILogger<ConfigurationMenuController> logger, ILoggedInUserService loggedInUserService) : base(logger, loggedInUserService)
        {            
            this.logger = logger;
        }

        /// <summary>
        /// get configuration menu
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("get-configurations-link-menu")]
        [AllowAnonymous]
        public IActionResult GetConfigurationMenu()
        {
            MenuPageViewModel model = new MenuPageViewModel();
            //model.MenuItems.Add(new MenuItemModel
            //{
            //    Name = "System Configuration",
            //    HelpText = "Manage System Configurations",
            //    //NavigateUrl = "/system-settings/system-configuration"
            //    NavigateUrl = "/"
            //});

            model.MenuItems.Add(new MenuItemModel
            {
                Name = "Loan Type",
                HelpText = "Manage Loan Type",
                NavigateUrl = "/system-settings/configuration/loan-types"
            });

            model.MenuItems.Add(new MenuItemModel
            {
                Name = "Approval Process",
                HelpText = "Manage Approval Process",
                NavigateUrl = "/system-settings/configuration/approval-processes"
            });

            model.MenuItems.Add(new MenuItemModel
            {
                Name = "Approval Group",
                HelpText = "Manage Approval Group",
                NavigateUrl = "/system-settings/configuration/approver-groups"
            });

            model.MenuItems.Add(new MenuItemModel
            {
                Name = "Document Checklist",
                HelpText = "Manage Document Checklist",
                NavigateUrl = "/system-settings/configuration/checklist-types"
            });

            ResponseMessage<MenuPageViewModel> response = new ResponseMessage<MenuPageViewModel>
            {
                Result = model
            };
            return Ok(response);
        }
    }
}
