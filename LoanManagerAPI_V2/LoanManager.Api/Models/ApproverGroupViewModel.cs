using LoanManager.ApplicationService.Models;
using LoanManager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Api.Models
{
    public class ApproverGroupViewModel
    {
        /// <summary>
        /// 
        /// </summary>
        public ApproverGroupModel ApproverGroupModel { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> ApproverGroupTypeSelectItems { get; set; }
    }
}
