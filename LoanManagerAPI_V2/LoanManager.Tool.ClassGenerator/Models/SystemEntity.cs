using System;
using System.Collections.Generic;

namespace Itm.Tool.ClassGenerator.Models
{
    public partial class SystemEntity
    {
        public SystemEntity()
        {            
            SystemEntityRight = new HashSet<SystemEntityRight>();
        }

        public int Id { get; set; }
        public int ModuleId { get; set; }
        public string EntityName { get; set; }
        public string Description { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
        public byte[] TimeStamp { get; set; }

        public ICollection<SystemEntityRight> SystemEntityRight { get; set; }
    }
}
