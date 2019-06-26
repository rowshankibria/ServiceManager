using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class CustomCategoryMapTypeModel
    {
        public CustomCategoryMapTypeModel()
        {
            //CustomCategoryMapTypeOptions = new HashSet<CustomCategoryMapTypeOption>();
            CustomCategoryTypes = new HashSet<CustomCategoryTypeModel>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        //public ICollection<CustomCategoryMapTypeOption> CustomCategoryMapTypeOptions { get; set; }
        public ICollection<CustomCategoryTypeModel> CustomCategoryTypes { get; set; }
    }
}
