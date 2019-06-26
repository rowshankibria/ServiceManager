using System;
using System.Collections.Generic;

namespace Itm.Tool.ClassGenerator.Models
{
    public partial class SystemEntityRight
    {
        public SystemEntityRight()
        {
          
        }

        public int Id { get; set; }
        public int EntityId { get; set; }
        public string RightKey { get; set; }
        public string Name { get; set; }
        public int RightType { get; set; }
        public string Description { get; set; }
        public bool IsB2bItem { get; set; }
        public int SortOrder { get; set; }
        public bool? IsActive { get; set; }
        public byte[] TimeStamp { get; set; }

        public SystemEntity Entity { get; set; }
       
    }
}
