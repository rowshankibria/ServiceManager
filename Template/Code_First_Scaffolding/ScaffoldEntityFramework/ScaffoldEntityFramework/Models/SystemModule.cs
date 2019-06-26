using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class SystemModule
    {
        public SystemModule()
        {
            SystemEntities = new HashSet<SystemEntity>();
        }

        public long ModuleId { get; set; }
        public string ModuleName { get; set; }
        public string Description { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
        public byte[] TimeStamp { get; set; }

        public ICollection<SystemEntity> SystemEntities { get; set; }
    }
}
