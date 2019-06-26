using LoanManager.Api.Providers;
using LoanManager.ApplicationService.Models;
using LoanManager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Api.Models
{
    public class TabPageViewModel : BaseViewModel
    {
        /// <summary>
        /// 
        /// </summary>
        ///public BusinessProfileModel BusinessProfileModel { get; set; }
        public List<TabModel> TabItems { get; set; }

    }
}
