
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

namespace Itm.Api.Controllers
{

    [Route("api/system-settings/roles")]
    public class RoleController : BaseController
    {
        private readonly IRoleService roleService;


        public RoleController(
            ILogger<RoleController> logger,
            ILoggedInUserService loggedInUserService,
            IRoleService roleService) : base(logger, loggedInUserService)
        {
            this.roleService = roleService;
        }

        [HttpGet]
        [Route("get-role-list")]
        [AllowAnonymous]
        public async Task<IActionResult> GetRoleList(DataSourceLoadOptions loadOptions)
        {
            return Ok(new ResponseMessage<LoadResult> { Result = await roleService.GetRolesAsync(loadOptions) });
        }

        [HttpGet]
        [Route("get-role")]
        [AllowAnonymous]
        public async Task<IActionResult> GetRole(long id)
        {
            return Ok(new ResponseMessage<RoleViewModel>
            {
                Result = new RoleViewModel
                {
                    Role = await roleService.GetRoleAsync(id),
                    RoleSelectItems = roleService.RoleSelectItems()
                }
            });
        }

        [HttpPost]
        [Route("create-role")]
        [ModelValidation]
        public async Task<IActionResult> CreateRoleAsync([FromBody] RoleModel model)
        {
            return Ok(new ResponseMessage<long> { Result = await roleService.CreateRoleAsync(model) });
        }

        [HttpPut]
        [Route("update-role/{id}")]
        [ModelValidation]
        public async Task<IActionResult> UpdateRoleAsync(long id, [FromBody] RoleModel model)
        {
            return Ok(new ResponseMessage<long> { Result = await roleService.UpdateRoleAsync(id, model) });
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("delete-role/{id}")]
        public async Task<IActionResult> DeleteRoleAsync(long id)
        {
            return Ok(await roleService.DeleteRoleAsync(id));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("delete-roles")]
        public async Task<IActionResult> DeleteRolesAsync([FromBody] List<long> ids)
        {
            return Ok(await roleService.DeleteRolesAsync(ids));
        }


        /// <summary>
        /// get type and category list
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("get-user-role-list/{roleId}")]
        public async Task<IActionResult> GetUserRoleList(long roleId, DataSourceLoadOptions loadOptions)
        {
            return Ok(new ResponseMessage<LoadResult> { Result = await roleService.GetUserByRoleAsync(roleId, loadOptions) });
        }

        /// <summary>
        /// get type and category list
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("get-user-permission-list/{parentRoleId}")]
        public async Task<IActionResult> GetUserPermissionList(long parentRoleId)
        {
            return Ok(new ResponseMessage<List<TreeModel>> { Result = await roleService.GetUserPermissionsAsync(parentRoleId) });
        }

        /// <summary>
        /// get type and category list
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("get-role-right-list")]
        [AllowAnonymous]
        public async Task<IActionResult> GetRightListByRoleList([FromBody] List<long> ids)
        {
            return Ok(new ResponseMessage<List<TreeModel>> { Result = await roleService.GetPermissionsByRoleListAsync(ids) });
        }

        [HttpGet]
        [Route("get-active-role-list")]
        [AllowAnonymous]
        public async Task<IActionResult> GetActiveRoleList()
        {
            return Ok(new ResponseMessage<List<TreeModel>> { Result = await roleService.GetActiveRolesAsync() });
        }
    }

}
