using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class CustomCategoryMapTypeOption
    {
        public CustomCategoryMapTypeOption()
        {
            CustomCategories = new HashSet<CustomCategory>();
        }

        public long Id { get; set; }
        public long CustomCategoryMapTypeId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? RowNo { get; set; }

        public CustomCategoryMapType CustomCategoryMapType { get; set; }
        public ICollection<CustomCategory> CustomCategories { get; set; }
    }
}
