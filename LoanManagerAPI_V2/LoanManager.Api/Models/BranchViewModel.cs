using LoanManager.ApplicationService.Models;
using LoanManager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Api.Models
{
    public class BranchViewModel
    {
        /// <summary>
        /// 
        /// </summary>
        public BranchModel BranchModel { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> RegionSelectItems { get; set; }        
    }
}
