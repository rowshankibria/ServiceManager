using LoanManager.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Linq;
using System.Security.Claims;

namespace LoanManager.Api.Providers
{
    //public class AuthorizeFilter : IAuthorizationFilter, ILoggedInUserService
    //{
    //    private readonly RoleRight RoleRight;
    //    private readonly ILoggedInUserService LoggedInUserService;
    //    private readonly IRoleService RoleService;

    //    public AuthorizeFilter(RoleRight roleRight, ILoggedInUserService loggedInUserService, IRoleService roleService)
    //    {
    //        RoleRight = roleRight;
    //        LoggedInUserService = loggedInUserService;
    //        RoleService = roleService;
    //    }

    //    public ILoggedInUser LoggedInUser => LoggedInUserService.LoggedInUser;

    //    public void OnAuthorization(AuthorizationFilterContext context)
    //    {
    //        if (!context.HttpContext.User.Identity.IsAuthenticated)
    //        {
    //            context.Result = new UnauthorizedResult();
    //            return;
    //        }

    //        if (!string.IsNullOrWhiteSpace(RoleRight.Roles))
    //        {
    //            string[] roles = RoleRight.Roles.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
    //            if (roles.Length == 0)
    //            {
    //                context.Result = new UnauthorizedResult();
    //                return;
    //            }

    //            if (!LoggedInUser.RoleIds.Any(x => roles.Contains(x)))
    //            {
    //                context.Result = new UnauthorizedResult();
    //            }
    //            return;
    //        }

    //        if (RoleRight.Right != 0)
    //        {
    //            if (!RoleService.IsRightExistAsync(RoleRight.Right).Result)
    //            {
    //                context.Result = new UnauthorizedResult();
    //            }
    //            return;
    //        }

    //        context.Result = new UnauthorizedResult();
    //    }
    //}

    //public class RoleRight
    //{
    //    public string Roles { get; set; }
    //    public int Right { get; set; }
    //}


    //public class ActionAuthorizeAttribute : TypeFilterAttribute
    //{
    //    public ActionAuthorizeAttribute(int Right = 0, string Roles = "") : base(typeof(AuthorizeFilter))
    //    {
    //        Arguments = new object[]
    //        {
    //            new RoleRight
    //            {
    //                Roles = Roles,
    //                Right = Right
    //            }
    //        };
    //    }
    //}
}
