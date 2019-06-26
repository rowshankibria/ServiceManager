
namespace LoanManager.Shared
{
    public class LoggedInUser : ILoggedInUser
    {
        public long UserId { get; set; }
        public long ContectId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string FullName { get; set; }
        public long[] RoleIds { get; set; }
        public string[] RoleNames { get; set; }
        public long BusinessProfileId { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string MobileNumber { get; set; }
        public string Gender { get; set; }
        public string ImageSource { get; set; }
        public bool IsDefaultBusinessProfile { get; set; }
        public bool IsSystemAdmin { get; set; }

    }
}
