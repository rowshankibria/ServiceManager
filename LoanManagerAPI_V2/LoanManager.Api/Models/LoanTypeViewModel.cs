using LoanManager.ApplicationService.Models;
using LoanManager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Api.Models
{
    public class LoanTypeViewModel
    {
        /// <summary>
        /// 
        /// </summary>
        public LoanTypeModel LoanTypeModel { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> CustomFieldControlTypeSelectItems { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> ApprovalProcessTypeSelectItems { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> CustomFieldGroupSelectItems { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> DocumentCategoryTypeSelectItems { get; set; }
    }
}