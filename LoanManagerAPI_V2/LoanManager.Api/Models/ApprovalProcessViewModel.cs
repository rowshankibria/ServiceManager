using LoanManager.ApplicationService.Models;
using LoanManager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Api.Models
{
    public class ApprovalProcessViewModel
    {
        /// <summary>
        /// 
        /// </summary>
        public ApprovalProcessModel ApprovalProcessModel { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> ApproverGroupSelectItems { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> CheckListSelectItems { get; set; }
    }
}
