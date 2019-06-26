
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
    
    [Route("api/system-settings/users")]
    public class UserController : BaseController
    {
        private readonly IUserService userService;
        private readonly ICustomCategoryService customCategoryService;
        private readonly ISharedService sharedService;
        private readonly IHostingEnvironment hostingEnvironment;
        private readonly IRoleService roleService;
        private readonly IContactService contactService; 

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="userService"></param>
        /// <param name="customCategoryService"></param>
        /// <param name="sharedService"></param>
        /// <param name="hostingEnvironment"></param>
        /// <param name="roleService"></param>
        /// <param name="contactService"></param>
        public UserController(ILogger<UserController> logger, 
                              IUserService userService, 
                              ICustomCategoryService customCategoryService, 
                              ISharedService sharedService,                              
                              IHostingEnvironment hostingEnvironment,
                              IRoleService roleService,
                              ILoggedInUserService loggedInUserService,
                              IContactService contactService) : base(logger, loggedInUserService)
        {
            this.userService = userService;         
            this.customCategoryService = customCategoryService;
            this.sharedService = sharedService;           
            this.hostingEnvironment = hostingEnvironment;
            this.roleService = roleService;
            this.contactService = contactService;    
            
        }

        /// <summary>
        /// get type and category list
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("get-active-user-list")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUserList()
        {
            return Ok(new ResponseMessage<IQueryable> { Result = await userService.GetActiveUsersAsync() });            
        }
        /// <summary>
        /// get type and category list
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("get-user-list")]
        [AllowAnonymous]
        public async Task<IActionResult> GetActiveUserList(DataSourceLoadOptions loadOptions)
        {
            return Ok(new ResponseMessage<LoadResult> { Result = await userService.GetActiveUsersAsync(loadOptions) });
        }
        /// <summary>
        /// Get user detail by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-user-detail")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUserDetailAsync(long id)
        {
            UserViewModel result = new UserViewModel
            {
                User = await userService.GetUserByIdAsync(id)
            };

           
            result.TimeZoneSelectItems = sharedService.GetTimeZoneSelectItemsAsync().Result;         
            result.UserTypeSelectItems = userService.GetUserTypeSelectItems();            
            result.TitleSelectItems = customCategoryService.GetCustomCategoryListByTypeIdAsync(ApplicationCustomCategory.TitleType).Result;
            result.UserRoleSelectItems = roleService.GetActiveRolesAsync();
            result.UserRightSelectItems = roleService.GetRightByRoleListAsync(id);
            result.IsSystemAdmin = LoggedInUser.IsSystemAdmin;
            //result.SecurityPolicySelectItems = securityProfile.GetSecurityProfileSelectItemsAsync().Result;

            ResponseMessage<UserViewModel> response = new ResponseMessage<UserViewModel> { Result = result };

            return Ok(response);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("get-entity-on-usertype")]
        public async Task<IActionResult> GetEntityOnUserTypeUsersAsync([FromBody] int userType)
        {    
            if(userType == (int)LoanManager.Configuration.Enums.UserType.Contact)
                return Ok(contactService.GetContactSelectItemsAsync());

            return Ok(contactService.GetEmployeeSelectItemsAsync());
        }

        /// <summary>
        /// get contact detail for user creation
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-contact-for-user-detail")]
        [AllowAnonymous]
        public async Task<IActionResult> GetContactDetailForUserCreationAsync(int id)
        {
            ContactViewModel result = new ContactViewModel
            {
                ContactModel = await contactService.GetEntityForUserAddAsync(id)
            };

            ResponseMessage<ContactViewModel> response = new ResponseMessage<ContactViewModel> { Result = result };
            return Ok(response);
        }
        /// <summary>
        /// insert user information
        /// </summary>        
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("insert-user-detail")]
        [ModelValidation]
        public async Task<IActionResult> SaveUserDetail([FromBody] UserModel userModel)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await userService.InsertUserDetailValuesAsync(userModel);
            return Ok(response);
        }
        /// <summary>
        /// Register new User
        /// </summary>        
        /// <param name="userRegistrationModel"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("register")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterUser([FromBody] UserRegistration userRegistrationModel)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            UserModel userModel = new UserModel();
            userModel.UserName = userRegistrationModel.Email;
            userModel.Email = userRegistrationModel.Email;
            userModel.Contact.FirstName = userRegistrationModel.FirstName;
            userModel.Contact.MiddleName = userRegistrationModel.MiddleName;
            userModel.Contact.LastName = userRegistrationModel.LastName;
            userModel.PasswordHash = userRegistrationModel.Password;

            response.Result = await userService.RegisterUserAsync(userModel);
            return Ok(response);
        }
        /// <summary>
        /// Update user information
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("update-user-detail/{id}")]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateUserDetail(long id, [FromBody] UserModel userModel)
        {
            ResponseMessage<long> response = new ResponseMessage<long>();
            response.Result = await userService.UpdateUserDetailValuesAsync(id, userModel);
            return Ok(response);
        }
        /// <summary>
        /// get configuration menu
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("upload-user-photo")]
        [AllowAnonymous]
        public IActionResult UploadUserPhoto()
        {
            ResponseMessage<string> response = new ResponseMessage<string>();

            try
            {
                var file = Request.Form.Files[0];
                string folderName = "images";
                string webRootPath = hostingEnvironment.WebRootPath;
                string newPath = Path.Combine(webRootPath, folderName);
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                if (file.Length > 0)
                {
                    string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string fullPath = Path.Combine(newPath, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                response.Result = "Upload Successful.";
                return Ok(response);
            }
            catch (System.Exception ex)
            {
                response.Result = "Image cannot be uploaded.";
                return Ok(response);
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("delete-user/{id}")]
        public async Task<IActionResult> DeleteUserAsync(long id)
        {
            return Ok(await userService.DeleteUserByIdAsync(id));
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("delete-users")]
        public async Task<IActionResult> DeleteUsersAsync([FromBody] List<long> ids)
        {
            return Ok(await userService.DeleteUsersAsync(ids));
        }
    }
}
