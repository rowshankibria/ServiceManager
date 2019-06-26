using LoanManager.ApplicationService.Models;
using LoanManager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Api.Models
{
    /// <summary>
    /// 
    /// </summary>
    public class CompanyViewModel
    {
        public CompanyModel Company { get; set; }
        public List<SelectModel> BusinessProfileSelectItems { get; set; }
        public List<SelectModel> CounrtySelectItems { get; set; }
        public List<SelectModel> StateSelectItems { get; set; }
        public List<SelectModel> IndustrySelectItems { get; set; }
        public List<SelectModel> OrganisationTypeSelectItems { get; set; }
        public List<SelectModel> RatingSelectItems { get; set; }
        public List<SelectModel> PreferredContactMethodSelectItems { get; set; }
        public List<SelectModel> RelationshipTypeSelectItems { get; set; }        
    }
}
