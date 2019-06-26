
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
    [Route("api/hrm/employee")]
    public class EmployeeController : BaseController
    {
        private readonly IEmployeeService employeeService;
        private readonly IBusinessProfileService businessProfileService;
        private readonly ICustomCategoryService customCategoryService;
        private readonly ISharedService sharedService;
        private readonly IBusinessCategoryService businessCategoryService;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="employeeService"></param>
        /// <param name="businessProfileService"></param>
        /// <param name="customCategoryService"></param>
        /// <param name="businessCategoryService"></param>
        /// <param name="loggedInUserService"></param>
        public EmployeeController(ILogger<EmployeeController> logger,
            IEmployeeService employeeService,
            IBusinessProfileService businessProfileService,
            ICustomCategoryService customCategoryService,
            IBusinessCategoryService businessCategoryService,
            ISharedService sharedService,
            ILoggedInUserService loggedInUserService) : base(logger, loggedInUserService)
        {
            this.employeeService = employeeService;
            this.businessProfileService = businessProfileService;
            this.customCategoryService = customCategoryService;
            this.businessCategoryService = businessCategoryService;
            this.sharedService = sharedService;
        }

        /// <summary>
        /// GetEmployeeListAsync
        /// </summary>
        /// <param name="loadOptions"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-employee-List")]
        public async Task<IActionResult> GetEmployeeListAsync(DataSourceLoadOptions loadOptions)
        {
            return Ok(new ResponseMessage<LoadResult> { Result = await employeeService.GetEmployeeListAsync(loadOptions) });
        }

        /// <summary>
        /// et-employee-page-tabs
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-employee-page-tabs/{id}")]
        public async Task<IActionResult> GetEmployeePageTabsAsync(int id)
        {

            return Ok(new ResponseMessage<TabPageViewModel>
            {
                Result = await Task.Run(() => new TabPageViewModel
                {
                    TabItems = employeeService.GetEmployeeDetailsTabs(id),
                    EntityType = ApplicationEntityType.Employee
                })
            });

        }
       
        /// <summary>
        /// get-employee-ById
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-employee-by-id/{id}")]
        public async Task<IActionResult> GetEmployeeByIdAsync(int id)
        {
            ResponseMessage<EmployeeViewModel> response = new ResponseMessage<EmployeeViewModel>();
            response.Result = new EmployeeViewModel
            {
                Employee = await employeeService.GetEmployeeByIdAsync(id),
                ImTypeSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.IMType).Result,
                TitleSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.TitleType).Result,
                PositionSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.PositionType).Result,
                GenderSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.GenderType).Result,
                PostingZoneTypeSelectItems = businessCategoryService.GetBusinessCategoryByType(ApplicationBusinessCategoryType.ZoneType),
                DepartmentSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.DepartmentType).Result,
                RegionSelectItems = await sharedService.GetCompanySelectItemsAsync(),
                BranchTypeSelectItems = await sharedService.GetBranchSelectItemsAsync()


            };
            return Ok(response);
        }


        /// <summary>
        /// create-employee
        /// </summary>
        /// <param name="employee"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("create-employee")]
        [ModelValidation]
        public async Task<IActionResult> CreateEmployee([FromBody] EmployeeModel employee)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await employeeService.SaveEmployeeAsync(0, employee);
            return Ok(response);
        }
        /// <summary>
        /// update-employee
        /// </summary>
        /// <param name="id"></param>
        /// <param name="employee"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("update-employee/{id}")]
        [ModelValidation]
        public async Task<IActionResult> UpdateEmployee(long id, [FromBody] EmployeeModel employee)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await employeeService.SaveEmployeeAsync(id, employee);
            return Ok(response);
        }

        /// <summary>
        /// Delete Employee
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("delete-employee/{id}")]
        public async Task<IActionResult> DeleteEmployee(long id)
        {
            return Ok(await employeeService.DeleteEmployeeAsync(id));
        }

    }
}
