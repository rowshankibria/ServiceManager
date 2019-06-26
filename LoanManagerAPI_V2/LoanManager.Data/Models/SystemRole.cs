using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoanManager.Data.Models
{
    public partial class SystemRole
    {
        public SystemRole()
        {
            SystemRoleRights = new HashSet<SystemRoleRight>();
            SystemUserRoles = new HashSet<SystemUserRole>();
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public long? ParentRoleId { get; set; }
        public bool IsActive { get; set; }
        public byte[] TimeStamp { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public long CreatedByContactId { get; set; }
        public DateTime? LastUpdatedDateTime { get; set; }
        public long? LastUpdatedByContactId { get; set; }

        public ICollection<SystemRoleRight> SystemRoleRights { get; set; }
        public ICollection<SystemUserRole> SystemUserRoles { get; set; }
    }
}
