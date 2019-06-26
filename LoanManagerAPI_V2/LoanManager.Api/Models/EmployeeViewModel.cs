using LoanManager.ApplicationService.Models;
using LoanManager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Api.Models
{
    public class EmployeeViewModel
    {
        public EmployeeModel Employee { get; set; }
     
        public List<SelectModel> ImTypeSelectItems { get;  set; }
        public List<SelectModel> BusinessProfileSelectItems { get;  set; }
        public List<SelectModel> TitleSelectItems { get;  set; }
        public List<SelectModel> PositionSelectItems { get;  set; }
        public List<SelectModel> TimezoneSelectItems { get;  set; }
        public List<SelectModel> SkillsSelectItems { get;  set; }
        public List<SelectModel> GenderSelectItems { get;  set; }
        public List<SelectModel> PreferredContactMethodSelectItems { get;  set; }
        public List<SelectModel> BusinessUnitSelectItems { get;  set; }
        
        public List<SelectModel> PostingZoneTypeSelectItems { get;  set; }
        public List<SelectModel> DepartmentSelectItems { get;  set; }
        public List<SelectModel> PreferredPhoneTypeSelectItems { get;  set; }


        public List<SelectModel> RegionSelectItems { get; set; }
        public List<SelectModel> BranchTypeSelectItems { get; set; }
    }
}
