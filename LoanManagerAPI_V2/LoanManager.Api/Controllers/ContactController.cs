
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
    [Route("api/crm/contact")]
    public class ContactController : BaseController
    {
        private readonly IContactService contactService;
        private readonly ICustomCategoryService customCategoryService;
        private readonly ILogger logger;
        private readonly ISharedService sharedService;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="contactService"></param>
        /// <param name="customCategoryService"></param>
        /// <param name="sharedService"></param>
        /// <param name="loggedInUserService"></param>
        public ContactController(ILogger<ContactController> logger, 
            IContactService contactService, 
            ICustomCategoryService customCategoryService, 
            ISharedService sharedService, 
            ILoggedInUserService loggedInUserService) : base(logger, loggedInUserService)
        {
            this.contactService = contactService;
            this.customCategoryService = customCategoryService;
            this.sharedService = sharedService;
            this.logger = logger;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("get-contact-list")]
        [AllowAnonymous]
        public async Task<IActionResult> GetContactsAsync()
        {
            return Ok(new ResponseMessage<IQueryable>
            {
                Result = await contactService.GetContacts()
            });
        }
        /// <summary>
        /// Get Contacts Async
        /// </summary>
        /// <param name="loadOptions">Dev expresss data model</param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-contacts")]
        public async Task<IActionResult> GetDevContactsAsync(DataSourceLoadOptions loadOptions)
        {
            return Ok(new ResponseMessage<LoadResult>
            {
                Result = await contactService.GetDevexContacts(loadOptions)
            });
        }
        /// <summary>
        /// Get Contact Async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-contact-details")]
        [AllowAnonymous]
        public async Task<IActionResult> GetContactAsync(long id)
        {
            return Ok(new ResponseMessage<ContactViewModel>
            {
                Result = new ContactViewModel
                {
                    ImTypeSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.IMType).Result,                   
                    CompanySelectItems = await sharedService.GetCompanySelectItemsAsync(),
                    TitleSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.TitleType).Result,
                    PositionSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.PositionType).Result,
                    TimezoneSelectItems = sharedService.GetTimeZoneSelectItemsAsync().Result,
                    SkillsSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.SkillType).Result,
                    GenderSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.GenderType).Result,
                    PreferredContactMethodSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.PreferredContactMethod).Result,
                    PreferredPhoneTypeSelectItems = contactService.GetPreferredPhoneTypeSelectedItem(),

                    ContactModel = await contactService.GetEntityAsync(id),
                }
            });
        }
        /// <summary>
        /// Get Contact Async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-contact")]
        [AllowAnonymous]
        public async Task<IActionResult> GetContactByIdAsync(long id)
        {
            return Ok(new ResponseMessage<ContactViewModel>
            {
                Result = new ContactViewModel
                {
                    ImTypeSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.IMType).Result,
                    CompanySelectItems = await sharedService.GetCompanySelectItemsAsync(),
                    TitleSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.TitleType).Result,
                    PositionSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.PositionType).Result,
                    TimezoneSelectItems = sharedService.GetTimeZoneSelectItemsAsync().Result,
                    SkillsSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.SkillType).Result,
                    GenderSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.GenderType).Result,
                    PreferredContactMethodSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.PreferredContactMethod).Result,
                    PreferredPhoneTypeSelectItems = contactService.GetPreferredPhoneTypeSelectedItem(),

                    ContactModel = await contactService.GetEntityAsync(id),
                }
            });
        }
        /// <summary>
        /// Create contact
        /// </summary>
        /// <param name="contact"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("create-contact")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> CreateContact([FromBody] ContactModel contact)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await contactService.SaveEntityAsync(contact);
            return Ok(response);
        }
        /// <summary>
        /// update contact
        /// </summary>
        /// <param name="id"></param>
        /// <param name="contact"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("update-contact")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateContact([FromBody] ContactModel contact)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await contactService.SaveEntityAsync(contact);
            return Ok(response);
        }
        /// <summary>
        /// delete contacts by id list
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("delete-contact/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteContactAsync(long id)
        {
            return Ok(await contactService.DeleteEntityAsync(id));
        }

        /// <summary>
        /// delete contacts by id list
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("delete-contacts")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteContactsAsync([FromBody]List<long> ids)
        {
            return Ok(await contactService.DeleteEntitiesAsync(ids));
        }
    }
}
