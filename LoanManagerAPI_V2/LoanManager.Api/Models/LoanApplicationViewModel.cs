using LoanManager.ApplicationService.Models;
using LoanManager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Api.Models
{
    public class LoanApplicationViewModel
    {
        /// <summary>
        /// 
        /// </summary>
        public LoanApplicationModel LoanApplicationModel { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> CompanySelectItems { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> TitleSelectItems { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> PositionSelectItems { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> TimezoneSelectItems { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> SkillsSelectItems { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> ImTypeSelectItems { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> GenderSelectItems { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> PreferredContactMethodSelectItems { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> PreferredPhoneTypeSelectItems { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> ApplicationStatusTypeSelectItems { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> LoanTypeSelectItems { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> BranchSelectItems { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> EmployeeSelectItems { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public List<SelectModel> CurrentAssigneeSelectItems { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<NoteModel> NoteLogsCurrentAssignee { get; set; }
    }
}
