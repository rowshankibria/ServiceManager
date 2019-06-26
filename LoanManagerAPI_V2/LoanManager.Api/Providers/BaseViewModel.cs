using LoanManager.Api.Models;
using LoanManager.Api.Providers;
using LoanManager.ApplicationService;
using LoanManager.ApplicationService.Models;
using LoanManager.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LoanManager.Api.Providers
{
    public abstract class BaseViewModel
    {
        public BaseViewModel()
        {

        }
        public int EntityType { get; set; }

        public bool IsDefaultBusinessProfile { get; set; } = false;
        

    }
}
