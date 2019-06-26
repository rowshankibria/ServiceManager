using System;
using System.Collections.Generic;

namespace Itm.Tool.ClassGenerator.Models
{
    public partial class BusinessCategory
    {
        public BusinessCategory()
        {
            BusinessCategoryMapTypes = new HashSet<BusinessCategoryMapType>();
        }

        public long Id { get; set; }
        public long BusinessCategoryTypeId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsDefault { get; set; }

        public BusinessCategoryType BusinessCategoryType { get; set; }
        public ICollection<BusinessCategoryMapType> BusinessCategoryMapTypes { get; set; }
    }
}
