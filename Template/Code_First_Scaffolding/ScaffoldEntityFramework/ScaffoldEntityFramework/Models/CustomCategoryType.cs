using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class CustomCategoryType
    {
        public CustomCategoryType()
        {
            CustomCategories = new HashSet<CustomCategory>();
        }

        public long Id { get; set; }
        public string RoutingKey { get; set; }
        public string ModuleName { get; set; }
        public string Name { get; set; }
        public string HelpText { get; set; }
        public long? RightId { get; set; }
        public int RowNo { get; set; }
        public long? CustomCategoryMapTypeId { get; set; }
        public string ImageSource { get; set; }
        public bool IsMapTypeRequired { get; set; }
        public bool IsMapTypeMappingUnique { get; set; }
        public bool IsInternal { get; set; }

        public SystemEntityRight Right { get; set; }
        public ICollection<CustomCategory> CustomCategories { get; set; }
    }
}
