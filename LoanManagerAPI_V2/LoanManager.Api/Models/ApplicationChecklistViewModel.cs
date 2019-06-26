using LoanManager.ApplicationService.Models;
using LoanManager.Data.Models;
using LoanManager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Api.Models
{
    public class ApplicationChecklistViewModel
    {
        /// <summary>
        /// 
        /// </summary>
        public LoanApplicationModel LoanApplicationModel { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<ApprovalEntityMappingChecklist> ApplicationChecklist { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<ApproverGroup> ApproverGroupList { get; set; }
    }
}
