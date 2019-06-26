using AutoMapper;
using LoanManager.ApplicationService.Models;
using LoanManager.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Drawing;
using System.Net.Http.Headers;
using LoanManager.Data;
using LoanManager.Configuration;
using LoanManager.Shared;
using LoanManager.Configuration.Enums;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;

namespace LoanManager.ApplicationService
{
    public class UserService : BaseService, IUserService
    {
        private readonly IRepository<SystemUser> userManager;
        private readonly IRepository<SystemUserRole> userRoleManager;
        private readonly IRepository<LoanType> loanTypeManager;
        private readonly IRepository<SystemRole> roleManager;
        private readonly IRepository<SecurityProfile> securityProfileRepository;
        private readonly IRepository<Photo> photoRepository;
        private readonly IRepository<Contact> contactRepository;
        private readonly IHostingEnvironment hostingEnvironment;
        private readonly IPhotoService photoService;
        private readonly IRoleService roleService;
        private readonly IMapper mapper;
        private readonly IStoredProcedureRepository storedProcedureRepository;

        /// <summary>
        /// constructor
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="photoService"></param>
        /// <param name="photoRepository"></param>
        /// <param name="roleService"></param>
        /// <param name="mapper"></param>
        /// <param name="userManager"></param>
        /// <param name="loggedInUserService"></param>
        /// <param name="hostingEnvironment"></param>
        /// <param name="roleManager"></param>
        public UserService(ILogger<UserService> logger, IPhotoService photoService,
            IRepository<SecurityProfile> securityProfileRepository,
            IRepository<LoanType> loanTypeManager,
            IRepository<Photo> photoRepository,
            IRepository<Contact> contactRepository,
            IRoleService roleService, IMapper mapper,
            IRepository<SystemUser> userManager,
            IRepository<SystemUserRole> userRoleManager,
            ILoggedInUserService loggedInUserService,
            IHostingEnvironment hostingEnvironment,
            IRepository<SystemRole> roleManager,
            IStoredProcedureRepository storedProcedureRepository) : base(logger, mapper, loggedInUserService)
        {

            this.securityProfileRepository = securityProfileRepository;
            this.userManager = userManager;
            this.hostingEnvironment = hostingEnvironment;
            this.photoRepository = photoRepository;
            this.photoService = photoService;
            this.roleService = roleService;
            this.roleManager = roleManager;
            this.contactRepository = contactRepository;
            this.mapper = mapper;
            this.loanTypeManager = loanTypeManager;
            this.userRoleManager = userRoleManager;
            this.storedProcedureRepository = storedProcedureRepository;
        }
        /// <summary>
        /// Get active user
        /// </summary>
        /// <param name="businessProfileId"></param>
        /// <param name="options"></param>
        /// <returns></returns>
        public async Task<IQueryable> GetActiveUsersAsync()
        {
            var query = from c in this.userManager.GetAll().Include(t => t.Contact)
                        select new
                        {
                            c.Id,
                            Name = c.Contact.FirstName + " " + c.Contact.LastName,
                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                            BusinessPhone = c.Contact.BusinessPhone,
                            HomePhone = c.Contact.HomePhone,
                            Mobile = c.Contact.Mobile,
                            Email = c.Email,
                            Active = c.IsActive
                        };

            return await Task.Run(() => query.AsQueryable());
        }
        /// <summary>
        /// Get active user
        /// </summary>
        /// <param name="businessProfileId"></param>
        /// <param name="options"></param>
        /// <returns></returns>
        public async Task<LoadResult> GetActiveUsersAsync(DataSourceLoadOptionsBase options)
        {
            var query = from c in this.userManager.GetAll().Include(t => t.Contact)
                        select new
                        {
                            c.Id,
                            c.UserName,
                            Name = c.Contact.FirstName + " " + c.Contact.LastName,
                            Gender = c.Contact.Gender != null ? c.Contact.Gender.Name : "",
                            BusinessPhone = c.Contact.BusinessPhone,                           
                            Mobile = c.Contact.Mobile,
                            Email = c.Email,
                            c.IsActive
                        };

            return await Task.Run(() => DataSourceLoader.Load(query, options));
        }
        /// <summary>
        /// get user type
        /// </summary>
        /// <returns></returns>
        public List<SelectModel> GetUserTypeSelectItems()
        {
            return LoanManager.Utilities.GetEnumValueList(typeof(LoanManager.Configuration.Enums.UserType));
        }
        /// <summary>
        /// Get user by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<UserModel> GetUserByIdAsync(long id)
        {
            if (id == 0)
            {
                return new UserModel();
            }

            SystemUser user = await userManager.Where(t => t.Id == id)
                                               .Include(t=>t.SystemUserRoles)
                                               .Include(t => t.Contact)
                                               .ThenInclude(t => t.Photo).FirstOrDefaultAsync();

            if (user == null)
            {
                throw new ItmNotFoundException("Application User not found");
            }


            var obj = Mapper.Map<UserModel>(user);
            if (obj != null)
            {
                //IList<string> roleNameList = await userManager.GetRolesAsync(user);
                var roleList = user.SystemUserRoles.Select(t => t.RoleId).ToList(); //roleManager..wh.Roles.Where(t => roleNameList.Contains(t.NormalizedName)).Select(t => t.Id).ToList();
                obj.UserRoles = roleList;

                if (obj.Contact.Photo == null)
                {
                    obj.Contact.Photo = new PhotoModel();
                }
            }

            return obj;
        }
        /// <summary>
        /// Get user by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<UserModel> GetUserByEmailAsync(string email, string password)
        {
            if (string.IsNullOrEmpty(email) && string.IsNullOrEmpty(password))
            {
                return new UserModel();
            }

            string encryptedPassword = Encryption.Encrypt(password);

            SystemUser user = await userManager.Where(t => t.Email == email && t.PasswordHash == encryptedPassword).Include(t => t.Contact).ThenInclude(t => t.Photo).FirstOrDefaultAsync();

            if (user == null)
            {
                return null;  //throw new ItmNotFoundException("Application User not found");
            }

            //var obj = Mapper.Map<UserModel>(user, new Action<IMappingOperationOptions>());
            var obj = new UserModel();
            obj.Id = user.Id;
            obj.UserType = user.UserType;
            obj.UserName = user.UserName;
            obj.Email = user.Email;
            obj.PasswordHash = user.PasswordHash;
            obj.ContactId = user.ContactId;
            obj.IsPendingAuthentication = user.IsPendingAuthentication;
            obj.SecurityProfileId = user.SecurityProfileId;
            obj.RequireChangePassword = user.RequireChangePassword;
            obj.IsActive = user.IsActive;
            obj.UserRoles = null;

            if (obj != null)
            {
                var contact = new ContactModel();
                contact.Id = user.Contact.Id;
                contact.ContactType = user.Contact.ContactType;
                contact.TitleId = user.Contact.TitleId;
                contact.FirstName = user.Contact.FirstName;
                contact.MiddleName = user.Contact.MiddleName;
                contact.LastName = user.Contact.LastName;
                contact.FullName = user.Contact.FullName;
                contact.GenderId = user.Contact.GenderId;
                contact.DateOfBirth = user.Contact.DateOfBirth;
                contact.PostionId = user.Contact.PostionId;
                contact.BusinessPhone = user.Contact.BusinessPhone;
                contact.HomePhone = user.Contact.HomePhone;
                contact.Mobile = user.Contact.Mobile;
                contact.Fax = user.Contact.Fax;
                contact.Email = user.Contact.Email;
                contact.ImTypeId = user.Contact.ImTypeId;
                contact.ImLoginId = user.Contact.ImLoginId;
                contact.PhotoId = user.Contact.PhotoId;
                contact.CitizenNo = user.Contact.CitizenNo;
                contact.CitizenIssueDistrictId = user.Contact.CitizenIssueDistrictId;
                contact.CitizenIssueDate = user.Contact.CitizenIssueDate;
                contact.VoterCertificateNo = user.Contact.VoterCertificateNo;
                contact.VoterCertificateIssueDistrictId = user.Contact.VoterCertificateIssueDistrictId;
                contact.VoterCertificateIssueDate = user.Contact.VoterCertificateIssueDate;
                contact.DrivingLicenseNo = user.Contact.DrivingLicenseNo;
                contact.DrivingLicenseIssueDistrictId = user.Contact.DrivingLicenseIssueDistrictId;
                contact.DrivingLicenseIssueDate = user.Contact.DrivingLicenseIssueDate;
                contact.PassportNo = user.Contact.PassportNo;
                contact.PassportIssueCountryId = user.Contact.PassportIssueCountryId;
                contact.PassportIssueDate = user.Contact.PassportIssueDate;
                contact.IsActive = user.Contact.IsActive;
                contact.Description = user.Contact.Description;

                obj.Contact = contact;

                if (obj.Contact.Photo == null)
                {
                    obj.Contact.Photo = new PhotoModel();
                }
            }

            return obj;
        }
        /// <summary>
        /// Get user by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<UserModel> GetUserByUserIdAsync(string userId, string password)
        {
            if (string.IsNullOrEmpty(userId) && string.IsNullOrEmpty(password))
            {
                return new UserModel();
            }

            string encryptedPassword = Encryption.Encrypt(password);

            SystemUser user = await userManager.Where(t => t.UserName == userId && t.PasswordHash == encryptedPassword).Include(t => t.Contact).ThenInclude(t => t.Photo).FirstOrDefaultAsync();

            if (user == null)
            {
                return null;  //throw new ItmNotFoundException("Application User not found");
            }

            //var obj = Mapper.Map<UserModel>(user, new Action<IMappingOperationOptions>());
            var obj = new UserModel();
            obj.Id = user.Id;
            obj.UserType = user.UserType;
            obj.UserName = user.UserName;
            obj.Email = user.Email;
            obj.PasswordHash = user.PasswordHash;
            obj.ContactId = user.ContactId;
            obj.IsPendingAuthentication = user.IsPendingAuthentication;
            obj.SecurityProfileId = user.SecurityProfileId;
            obj.RequireChangePassword = user.RequireChangePassword;
            obj.IsActive = user.IsActive;
            obj.UserRoles = null;

            if (obj != null)
            {
                var contact = new ContactModel();
                contact.Id = user.Contact.Id;
                contact.ContactType = user.Contact.ContactType;
                contact.TitleId = user.Contact.TitleId;
                contact.FirstName = user.Contact.FirstName;
                contact.MiddleName = user.Contact.MiddleName;
                contact.LastName = user.Contact.LastName;
                contact.FullName = user.Contact.FullName;
                contact.GenderId = user.Contact.GenderId;
                contact.DateOfBirth = user.Contact.DateOfBirth;
                contact.PostionId = user.Contact.PostionId;
                contact.BusinessPhone = user.Contact.BusinessPhone;
                contact.HomePhone = user.Contact.HomePhone;
                contact.Mobile = user.Contact.Mobile;
                contact.Fax = user.Contact.Fax;
                contact.Email = user.Contact.Email;
                contact.ImTypeId = user.Contact.ImTypeId;
                contact.ImLoginId = user.Contact.ImLoginId;
                contact.PhotoId = user.Contact.PhotoId;
                contact.CitizenNo = user.Contact.CitizenNo;
                contact.CitizenIssueDistrictId = user.Contact.CitizenIssueDistrictId;
                contact.CitizenIssueDate = user.Contact.CitizenIssueDate;
                contact.VoterCertificateNo = user.Contact.VoterCertificateNo;
                contact.VoterCertificateIssueDistrictId = user.Contact.VoterCertificateIssueDistrictId;
                contact.VoterCertificateIssueDate = user.Contact.VoterCertificateIssueDate;
                contact.DrivingLicenseNo = user.Contact.DrivingLicenseNo;
                contact.DrivingLicenseIssueDistrictId = user.Contact.DrivingLicenseIssueDistrictId;
                contact.DrivingLicenseIssueDate = user.Contact.DrivingLicenseIssueDate;
                contact.PassportNo = user.Contact.PassportNo;
                contact.PassportIssueCountryId = user.Contact.PassportIssueCountryId;
                contact.PassportIssueDate = user.Contact.PassportIssueDate;
                contact.IsActive = user.Contact.IsActive;
                contact.Description = user.Contact.Description;

                obj.Contact = contact;

                if (obj.Contact.Photo == null)
                {
                    obj.Contact.Photo = new PhotoModel();
                }
            }

            return obj;
        }
        /// <summary>
        /// insert user detail
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<long> InsertUserDetailValuesAsync(UserModel userModel)
        {
            if (userModel == null)
            {
                throw new ItmArgumentMissingException("Invalid user data");
            }
            else
            {
                var result = this.ValidateUserEmail(0, userModel.Email);
                if (!result)
                    throw new ItmArgumentMissingException("Email cannot be duplicated.");

                result = this.ValidateUserName(0, userModel.UserName);
                if (!result)
                    throw new ItmArgumentMissingException("Username cannot be duplicated.");
            }

            SystemUser userObj = new SystemUser();

            if (!userModel.Contact.Photo.IsUpdated && !userModel.Contact.Photo.IsDeleted)
            {
                userModel.Contact.Photo = null;
            }

            if (userObj != null)
            {
                Mapper.Map(userModel, userObj);
                userObj.PasswordHash = Encryption.Encrypt(userModel.NewPassword);

                //application user
                //userObj.Id = Guid.NewGuid().ToString();                
                //userObj.NormalizedUserName = userModel.UserName;
                //userObj.NormalizedEmail = userModel.Email;
                //userObj.EmailConfirmed = true;
                //userObj.PhoneNumber = userModel.Contact.BusinessPhone;
                //userObj.TwoFactorEnabled = false;
                //userObj.CreatedDateTime = DateTime.UtcNow;
                //userObj.CreatedByContactId = LoggedInUser.ContectId;                
                //userObj.IsActive = true;

                if (userModel.Contact.Id == 0)
                {
                    userObj.Contact.BusinessPhone = userModel.Contact.BusinessPhone;
                    userObj.Contact.Mobile = userModel.Contact.Mobile;
                    userObj.Contact.Email = userObj.Email;
                    userObj.Contact.CreatedDateTime = DateTime.UtcNow;
                    userObj.Contact.ContactType = (int)LoanManager.Configuration.Enums.ContactType.User;
                }
                else
                {
                    var objContact = this.contactRepository.Where(t => t.Id == userModel.Contact.Id).FirstOrDefault();
                    userObj.Contact = objContact;
                }


                //photo entity 
                if (!string.IsNullOrEmpty(userModel.Contact.Photo?.UploadedFileName))
                {                  

                    Photo photo = new Photo();
                    photo.PhotoThumb = this.photoService.GetImageFile(userModel.Contact.Photo.UploadedFileName);
                    photo.FileName = userModel.Contact.FirstName + "_" + userModel.Contact.LastName;
                    photo.IsDefault = true;
                    photo.IsVisibleInPublicPortal = true;
                    userObj.Contact.Photo = photo;
                }

                await this.userManager.CreateAsync(userObj);
            }
            return userObj.Id;
        }
        /// <summary>
        /// update user detail
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userModel"></param>
        /// <returns></returns>
        public async Task<long> UpdateUserDetailValuesAsync(long id, UserModel userModel)
        {
            if (userModel == null)
            {
                throw new ItmArgumentMissingException("Invalid user data");
            }
            else
            {
                var result = this.ValidateUserEmail(id, userModel.Email);
                if (!result)
                    throw new ItmInvalidDataException("Email cannot be duplicated.");

                result = this.ValidateUserName(id, userModel.UserName);
                if (!result)
                    throw new ItmInvalidDataException("Username cannot be duplicated.");
            }

            SystemUser userObj = new SystemUser();

            if (!userModel.Contact.Photo.IsUpdated && !userModel.Contact.Photo.IsDeleted)
            {
                userModel.Contact.Photo = null;
            }

            if (userModel.Contact.Photo != null)
            {
                userObj = await userManager.Where(t => t.Id == id)
                                           .Include(t=>t.SystemUserRoles)
                                           .Include(t => t.Contact).ThenInclude(t => t.Photo)
                                           .Include(t => t.Contact).FirstOrDefaultAsync();
            }
            else
            {
                userObj = await userManager.Where(t => t.Id == id)
                                           .Include(t => t.SystemUserRoles)
                                           .Include(t => t.Contact).FirstOrDefaultAsync();
            }

            if (userObj == null)
            {
                throw new ItmNotFoundException("Application User not found");
            }

            if (userObj != null)
            {
                Mapper.Map(userModel, userObj);
                userObj.Contact.Email = userModel.Email;
                userObj.PasswordHash = Encryption.Encrypt(userModel.NewPassword);
                //userObj.PhoneNumber = userModel.Contact.BusinessPhone;
                //userObj.NormalizedUserName = userModel.UserName;
                //userObj.NormalizedEmail = userModel.Email;

                #region Photo Entity

                //update or insert photo entity
                if (userModel.Contact.PhotoId > 0 && userModel.Contact.Photo != null)
                {
                    if (userModel.Contact.Photo.IsDeleted)
                    {
                        userObj.Contact.PhotoId = null;
                        userObj.Contact.Photo = null;
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(userModel.Contact.Photo?.UploadedFileName))
                        {
                            userObj.Contact.Photo.OrginalFileName = userModel.Contact.Photo.UploadedFileName;
                            userObj.Contact.Photo.PhotoThumb = this.photoService.GetImageFile(userModel.Contact.Photo.UploadedFileName);
                        }
                    }
                }
                else if (!string.IsNullOrEmpty(userModel.Contact.Photo?.UploadedFileName))
                {
                    Photo photo = new Photo();
                    photo.PhotoThumb = this.photoService.GetImageFile(userModel.Contact.Photo.UploadedFileName);
                    photo.FileName = userModel.Contact.FirstName + "_" + userModel.Contact.LastName;
                    photo.OrginalFileName = userModel.Contact.Photo.UploadedFileName;
                    photo.IsDefault = true;
                    photo.IsVisibleInPublicPortal = true;
                    userObj.Contact.Photo = photo;
                }

                if (userModel.UserRoles.Count > 0)
                {
                    //delete previous record
                    this.userRoleManager.Delete(t => t.UserId == id);
                }

                //insert record for specialisation
                foreach (long roleId in userModel.UserRoles)
                {
                    SystemUserRole userRoleObj = new SystemUserRole();
                    userRoleObj.RoleId = roleId;
                    userObj.SystemUserRoles.Add(userRoleObj);
                }

                #endregion


                //await userManager.ChangePasswordAsync(userObj, userObj.PasswordHash, userModel.NewPassword);
                await userManager.UpdateAsync(userObj);
                //Delete photo
                if (userModel.Contact.Photo != null && userModel.Contact.Photo.IsDeleted)
                {
                    photoRepository.Delete(p => p.Id == userModel.Contact.Photo.Id);
                }
            }

            return userObj.Id;
        }
        /// <summary>
        /// Delete user
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public Task<bool> DeleteUserByIdAsync(long id)
        {
            if (id == 0)
            {
                throw new ItmArgumentMissingException("User not found");
            }
            //if (id == LoggedInUser.UserId)
            //{
            //    throw new ItmArgumentMissingException("Logged In user cannot be deleted.");
            //}

            var user = userManager.Where(r => r.Id == id).FirstOrDefault();
            if (user == null)
            {
                throw new ItmArgumentMissingException($"User: {user.UserName} not found");
            }
            else
            {
                //Check for validation
                var validationSummary = storedProcedureRepository.GetValidationSummary(DeletableEntityType.User, user.ContactId);
                if (validationSummary != null && !validationSummary.IsValid)
                {
                    throw new ItmArgumentMissingException(validationSummary.ValidationMessage);
                }
            }

            return Task.Run(() =>
            {
                if (user == null)
                {
                    throw new ItmArgumentMissingException($"User: {user.UserName} not found");
                }

                userManager.DeleteAsync(user);

                return true;
            });
        }
        /// <summary>
        /// Delete user
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public Task<bool> DeleteUsersAsync(List<long> ids)
        {
            if (ids == null)
            {
                throw new ItmArgumentMissingException("User not found");
            }
            return Task.Run(() =>
            {
                foreach (long id in ids)
                {
                    var user = userManager.Where(r => r.Id == id).FirstOrDefault();
                    if (user == null)
                    {
                        throw new ItmArgumentMissingException($"user: {user.UserName} not found");
                    }

                    userManager.DeleteAsync(user);
                }
                return true;
            });
        }
        /// <summary>
        /// check whether this username exists or not
        /// </summary>
        /// <param name="id"></param>
        /// <param name="username"></param>
        /// <returns></returns>
        public bool ValidateUserName(long id, string username)
        {
            bool isValidUsername = true;

            //if it is not empty
            if (id > 0)
            {
                SystemUser userObj = userManager.Where(t => t.Id != id && t.UserName == username).FirstOrDefault();
                if (userObj != null)
                {
                    isValidUsername = false;
                }
            }
            else
            {
                SystemUser userObj = userManager.Where(t => t.UserName == username).FirstOrDefault();
                if (userObj != null)
                {
                    isValidUsername = false;
                }
            }

            return isValidUsername;
        }
        /// <summary>
        /// check whether this email is used to another user or not
        /// </summary>
        /// <param name="id"></param>
        /// <param name="email"></param>
        /// <returns></returns>
        public bool ValidateUserEmail(long id, string email)
        {
            bool isValidEmail = true;

            //if it is not empty
            if (id > 0)
            {
                SystemUser userObj = userManager.Where(t => t.Id != id && t.Email == email).FirstOrDefault();
                if (userObj != null)
                {
                    isValidEmail = false;
                }
            }
            else
            {
                SystemUser userObj = userManager.Where(t => t.Email == email).FirstOrDefault();
                if (userObj != null)
                {
                    isValidEmail = false;
                }
            }

            return isValidEmail;
        }

        /// <summary>
        /// Register User
        /// </summary>
        /// <param name="userModel"></param>
        /// <returns>User ID</returns>
        public async Task<long> RegisterUserAsync(UserModel userModel)
        {
            if (userModel == null)
            {
                throw new ItmArgumentMissingException("Invalid user data");
            }
            else
            {
                var result = this.ValidateUserEmail(0, userModel.Email);
                if (!result)
                    throw new ItmArgumentMissingException("Another user with this email already exists.");
            }

            SystemUser userObj = new SystemUser();
            userModel.Contact.Photo = null;

            if (userObj != null)
            {
                //Mapper.Map(userModel, userObj);
                userObj.Contact = new Contact();

                //application user
                userObj.UserType = (int)UserType.User;
                userObj.UserName = userModel.Email;
                userObj.Email = userModel.Email;
                userObj.PasswordHash = Encryption.Encrypt(userModel.PasswordHash);
                userObj.IsPendingAuthentication = false;
                userObj.CreatedDateTime = DateTime.UtcNow;
                userObj.IsActive = true;

                userObj.Contact.FirstName = userModel.Contact.FirstName;
                userObj.Contact.MiddleName = userModel.Contact.MiddleName;
                userObj.Contact.LastName = userModel.Contact.LastName;
                userObj.Contact.CreatedDateTime = DateTime.UtcNow;
                userObj.Contact.ContactType = (int)LoanManager.Configuration.Enums.ContactType.Client;

                await userManager.CreateAsync(userObj);
            }

            return userObj.Id;
        }
    }
}
