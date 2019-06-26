using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Logging;
using LoanManager.Shared;

namespace LoanManager.Api.Providers
{
    [ValidationFilter]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]

    public abstract class BaseController : ControllerBase, ILoggedInUserService
    {
        private readonly ILoggedInUserService loggedInUserService;
        public BaseController(ILogger logger , ILoggedInUserService loggedInUserService)
        {
            Logger = logger;
            this.loggedInUserService = loggedInUserService;
        }

        public ILoggedInUser LoggedInUser => loggedInUserService.LoggedInUser;

        protected ILogger Logger { get; }        
    }
}
