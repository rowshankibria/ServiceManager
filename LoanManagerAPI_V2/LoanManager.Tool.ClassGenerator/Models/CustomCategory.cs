using System;
using System.Collections.Generic;

namespace Itm.Tool.ClassGenerator.Models
{
    public partial class CustomCategory
    {
        public CustomCategory()
        {
           
        }

        public long Id { get; set; }
        public long CustomCategoryTypeId { get; set; }
        public long? CustomCategoryMapTypeOptionId { get; set; }
        public string Name { get; set; }
        public string Desciption { get; set; }
        public bool IsDefault { get; set; }
        public bool IsActive { get; set; }
        public int DisplayOrder { get; set; }
        public long? BusinessProfileId { get; set; }
        public string Code { get; set; }     
         
    }
}
