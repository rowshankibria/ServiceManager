using System;
using System.Collections.Generic;

namespace Itm.Tool.ClassGenerator.Models
{
    public partial class CustomCategoryMapTypeOption
    {
        public CustomCategoryMapTypeOption()
        {
        
        }

        public long Id { get; set; }
        public long CustomCategoryMapTypeId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? RowNo { get; set; }

        public CustomCategoryMapType CustomCategoryMapType { get; set; }
        
    }
}
