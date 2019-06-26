using System;
using System.Collections.Generic;

namespace LoanManager.ApplicationService.Models
{
    public class UserModel
    {
        public UserModel()
        {
            this.Contact = new ContactModel();
            this.UserRoles = new List<long>();
        }


        public long Id { get; set; }
        public int? UserType { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public long ContactId { get; set; }
        public bool IsPendingAuthentication { get; set; }
        public long? SecurityProfileId { get; set; }
        public bool RequireChangePassword { get; set; }
        public bool IsSystemAdmin { get; set; }
        public bool IsActive { get; set; }
        public ContactModel Contact { get; set; }
        public List<long> UserRoles { get; set; }
        public string NewPassword { get; set; }
    }
}
