using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class CustomCategoryMapType
    {
        public CustomCategoryMapType()
        {
            CustomCategoryMapTypeOptions = new HashSet<CustomCategoryMapTypeOption>();
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public ICollection<CustomCategoryMapTypeOption> CustomCategoryMapTypeOptions { get; set; }
    }
}
