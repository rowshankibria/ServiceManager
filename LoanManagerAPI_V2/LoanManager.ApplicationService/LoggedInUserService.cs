using LoanManager.ApplicationService.Models;
using LoanManager.Data;
using LoanManager.Data.Models;
using LoanManager.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace LoanManager.ApplicationService
{
    public class LoggedInUserService : ILoggedInUserService
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IRepository<SystemUser> userManager;
        private readonly IRepository<SystemRole> roleManager;
        private readonly IMemoryCache memoryCache;
        private readonly IServiceProvider services;

        private readonly object userLock = new object();

        ILoggedInUser loggedInUser;

        public LoggedInUserService(
            IHttpContextAccessor httpContextAccessor
            //, IRepository<SystemUser> userManager
            //, IRepository<SystemRole> roleManager
            , IServiceProvider services
            , IMemoryCache memoryCache)
        {
            this.httpContextAccessor = httpContextAccessor;
            //this.userManager = userManager;
            //this.roleManager = roleManager;
            this.memoryCache = memoryCache;
            this.services = services;
            //this.LoggedInUser = this.GetLoggedInUser();

        }

        public ILoggedInUser LoggedInUser
        {
            get
            {
                if (loggedInUser != null)
                    return loggedInUser;
                else
                {
                    lock (userLock)
                    {
                        return GetLoggedInUser();
                    }
                }
            }
            //rivate set;
        }

        public ILoggedInUser GetLoggedInUser()
        {

            var userRepository = services.GetRequiredService<IRepository<SystemUser>>();
            var businessProfileRepository = services.GetRequiredService<IRepository<BusinessProfile>>();
            //var roleRepository = services.GetRequiredService<IRepository<SystemRole>>();
            //var user = manager.Users.FirstOrDefault(u => u.Id == _userManager.GetUserId(user));
            //this.userManager = new Repository<SystemUser>()

            //Branch user1 = userRepository.GetAll().FirstOrDefault();
            //if (!httpContextAccessor.HttpContext.User.Identity.IsAuthenticated || !httpContextAccessor.HttpContext.User.HasClaim(x => x.Type == ClaimTypes.NameIdentifier))
            //{
            //    throw new ItmUnauthorizedException("User not Authenticated");
            //}

            //if (!httpContextAccessor.HttpContext.User.HasClaim(x => x.Type == ApplicationConstants.BUSSINESS_PROFILE_ID_CLAIM))
            //{
            //    throw new ItmInvalidDataException("Business profile not found for this user");
            //}

            string userIdStr = httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti).Value;

            //if (string.IsNullOrWhiteSpace(userId))
            //{
            //    throw new ItmUnauthorizedException("Unauthorized user");
            //}

            //loggedInUser = GetUserFromCache(userId);

            long userId = userIdStr.ToInt();
            long businessProfileId = 0;

            BusinessProfile objBP = businessProfileRepository.Where(x => x.IsDefault).FirstOrDefault();
            if (objBP != null)
            {
                businessProfileId = objBP.Id;
            }

            if (loggedInUser != null)
            {
                return loggedInUser;
            }

            SystemUser user = userRepository.Where(x => x.Id == userId).Include(x => x.Contact).Include(t => t.SystemUserRoles).FirstOrDefault();

            if (user.Contact == null)
            {
                throw new ItmInvalidDataException("Contact not found for this user");
            }

            if (user == null)
            {
                throw new ItmUnauthorizedException("Invalid user");
            }

            //string[] userRoleNames = userManager.GetRolesAsync(user).Result.ToArray();

            //int businessProfileId = httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(x => x.Type == ApplicationConstants.BUSSINESS_PROFILE_ID_CLAIM).Value.ToInt();
            long[] roleList = user.SystemUserRoles.Select(t => t.RoleId).ToArray();
            string[] roleListName = { "" };//user.SystemUserRoles.Select(t => t.Role.Name).ToArray();

            loggedInUser = new LoggedInUser
            {
                UserId = user.Id,
                ContectId = user.ContactId,
                FullName = ($"{user.Contact.FirstName ?? ""} {user.Contact.MiddleName ?? ""} {user.Contact.LastName ?? ""}"),
                FirstName = user.Contact.FirstName,
                LastName = user.Contact.LastName,
                MiddleName = user.Contact.MiddleName,
                EmailAddress = user.Contact.Email,
                MobileNumber = user.Contact.Mobile,
                PhoneNumber = user.Contact.HomePhone,
                ImageSource = "",
                RoleIds = roleList,
                RoleNames = roleListName,
                BusinessProfileId = businessProfileId,
                IsDefaultBusinessProfile = false,
                Gender = "",
                IsSystemAdmin = user.IsSystemAdmin
            };

            //RoleIds = roleManager.Roles.Where(r => userRoleNames.Contains(r.Name)).Select(r => r.Id).ToArray(),
            //RoleNames = userRoleNames,
            //BusinessProfileId = businessProfileId,
            //TODO
            //Gender = (user.Contact.Gender ?? 1) == 1 ? "Male" : "Female",
            //IsDefaultBusinessProfile = user.Contact.ContactBusinessProfiles.Any(t=>t.BusinessProfileId == businessProfileId && t.BusinessProfile.IsDefault)


            //SetUserToCache(userId, loggedInUser);
            return loggedInUser;
        }


        public LoggedInUser GetUserFromCache(string userId)
        {
            memoryCache.TryGetValue(userId, out LoggedInUser user);
            return user;
        }

        public void SetUserToCache(string userId, ILoggedInUser user)
        {
            MemoryCacheEntryOptions options = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(10), // cache will expire in 25 seconds
                SlidingExpiration = TimeSpan.FromSeconds(5) // caceh will expire if inactive for 5 seconds
            };

            memoryCache.Set(userId, user, options);
        }
    }
}
