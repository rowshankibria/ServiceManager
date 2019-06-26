using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class SystemUser
    {
        public SystemUser()
        {
            SystemUserRoles = new HashSet<SystemUserRole>();
        }

        public long Id { get; set; }
        public int UserType { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public long ContactId { get; set; }
        public bool IsPendingAuthentication { get; set; }
        public long? SecurityProfileId { get; set; }
        public bool RequireChangePassword { get; set; }
        public bool IsActive { get; set; }
        public bool IsSystemAdmin { get; set; }        
        public byte[] TimeStamp { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public long? CreatedByContactId { get; set; }
        public DateTime? LastUpdatedDateTime { get; set; }
        public long? LastUpdatedByContactId { get; set; }

        public Contact Contact { get; set; }
        public Contact CreatedByContact { get; set; }
        public SecurityProfile SecurityProfile { get; set; }
        public ICollection<SystemUserRole> SystemUserRoles { get; set; }
    }
}
