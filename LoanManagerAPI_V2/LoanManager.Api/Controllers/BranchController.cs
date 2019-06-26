
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
    [Route("api/crm/branch")]
    public class BranchController : BaseController
    {
        private readonly IBranchService branchService;
        private readonly ICompanyService companyService;        
        private readonly ILogger logger;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="branchService"></param>
        /// <param name="companyService"></param>
        /// <param name="loggedInUserService"></param>
        public BranchController(ILogger<BranchController> logger,
            IBranchService branchService,
            ICompanyService companyService,             
            ILoggedInUserService loggedInUserService) : base(logger, loggedInUserService)
        {
            this.branchService = branchService;
            this.companyService = companyService;            
            this.logger = logger;
        }
       
        /// <summary>
        /// Get Contacts Async
        /// </summary>
        /// <param name="loadOptions">Dev expresss data model</param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-branches")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDevexLoanTypesAsync(DataSourceLoadOptions loadOptions)
        {
            return Ok(new ResponseMessage<LoadResult>
            {
                Result = await branchService.GetDevexBranchesAsynch(loadOptions)
            });
        }

       
        /// <summary>
        /// Get Contact Async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-branch-detail")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBranchAsync(long id)
        {
            ResponseMessage<BranchViewModel> response = new ResponseMessage<BranchViewModel>
            {
                Result = new BranchViewModel()
            };

            response.Result.BranchModel = await branchService.GetEntityAsync(id);
            response.Result.RegionSelectItems = companyService.CompanySelectItems();

            return Ok(response);

        }
        /// <summary>
        /// Create contact
        /// </summary>
        /// <param name="branchModel"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("create-branch")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> CreateBranch([FromBody] BranchModel branchModel)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await branchService.SaveEntityAsync(branchModel);
            return Ok(response);
        }
       
        /// <summary>
        /// update contact
        /// </summary>
        /// <param name="id"></param>
        /// <param name="loanType"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("update-branch")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateBranch([FromBody] BranchModel branchModel)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await branchService.SaveEntityAsync(branchModel);
            return Ok(response);
        }
        /// <summary>
        /// delete contacts by id list
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("delete-branch/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteBranchAsync(long id)
        {
            return Ok(await branchService.DeleteEntityAsync(id));
        }

        /// <summary>
        /// delete contacts by id list
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("delete-branches")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteBranchesAsync([FromBody]List<long> ids)
        {
            return Ok(await branchService.DeleteEntitiesAsync(ids));
        }


    }
}
