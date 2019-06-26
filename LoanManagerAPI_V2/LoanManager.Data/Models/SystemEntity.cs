using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class SystemEntity
    {
        public SystemEntity()
        {
            SystemEntityRights = new HashSet<SystemEntityRight>();
        }

        public long Id { get; set; }
        public long ModuleId { get; set; }
        public string EntityName { get; set; }
        public string Description { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
        public byte[] TimeStamp { get; set; }

        public SystemModule Module { get; set; }
        public ICollection<SystemEntityRight> SystemEntityRights { get; set; }
    }
}
