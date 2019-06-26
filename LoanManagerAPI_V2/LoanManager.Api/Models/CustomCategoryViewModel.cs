using LoanManager.ApplicationService.Models;
using LoanManager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Api.Models
{
    public class CustomCategoryViewModel
    {
        public CustomCategoryModel CustomCategory { get; set; }

        public CustomCategoryTypeModel CustomCategoryType { get; set; }

        public List<SelectModel> BusinessProfileSelectItems { get; set; }
        public List<SelectModel> MapTypeSelectItems { get; set; }
        //public List<SelectModel> ParentSelectItems { get; set; }
    }
}
