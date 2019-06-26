using LoanManager.Api.Providers;
using LoanManager.ApplicationService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Api.Models
{
    class ApplicationMenuViewModel : BaseViewModel
    {
        
        public List<ApplicationMenuModel> ApplicationMenu { get; set; }
        public ApplicationHeaderModel ApplicationHeader { get; set; }

        public bool IsSystemAdmin { get; set; }
    }
}
