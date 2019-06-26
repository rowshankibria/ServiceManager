using System;
using System.Collections.Generic;

namespace Itm.Tool.ClassGenerator.Models
{
    public partial class BusinessCategoryMapType
    {
        public BusinessCategoryMapType()
        {

        }

        public long Id { get; set; }
        public long BusinessCategoryId { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public string Description { get; set; }

        public BusinessCategory BusinessCategory { get; set; }

    }
}
