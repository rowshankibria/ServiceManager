using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class CustomCategoryModuleModel
    {
        public CustomCategoryModuleModel()
        {
            CustomCategoryTypes = new HashSet<CustomCategoryTypeModel>();
        }

        public string Name { get; set; }
        
        public ICollection<CustomCategoryTypeModel> CustomCategoryTypes { get; set; }
    }
}
