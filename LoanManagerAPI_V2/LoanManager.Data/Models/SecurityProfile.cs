using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class SecurityProfile
    {
        public SecurityProfile()
        {
            SystemUsers = new HashSet<SystemUser>();
        }

        public long Id { get; set; }
        public string ProfileName { get; set; }
        public string Descriptions { get; set; }
        public bool IsDefault { get; set; }
        public int MinPasswordLength { get; set; }
        public int MaxPasswordLength { get; set; }
        public bool RequireLowerCaseCharacter { get; set; }
        public int MinLowerCaseCharacter { get; set; }
        public bool RequireUpperCaseCharacter { get; set; }
        public int MinUpperCaseCharacter { get; set; }
        public bool RequireDigit { get; set; }
        public int MinDigit { get; set; }
        public bool RequireSpecialCharacter { get; set; }
        public int MinSpecialCharacter { get; set; }
        public int DefaultSessionTimeout { get; set; }
        public bool IsActive { get; set; }

        public ICollection<SystemUser> SystemUsers { get; set; }
    }
}
