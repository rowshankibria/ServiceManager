using LoanManager.ApplicationService.Models;
using LoanManager.Shared;
using System.Collections.Generic;

namespace LoanManager.Api.Models
{
    public class RoleViewModel
    {
        public RoleModel Role { get; set; }
        public List<SelectModel> BusinessProfileSelectItems { get; set; }
        public List<SelectModel> RoleSelectItems { get; set; }
    }
}
