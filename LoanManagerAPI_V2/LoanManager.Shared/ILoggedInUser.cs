namespace LoanManager.Shared
{
    public interface ILoggedInUser
    {
        long UserId { get; set; }
        long ContectId { get; set; }
        string FirstName { get; set; }
        string LastName { get; set; }
        string MiddleName { get; set; }
        string FullName { get; set; }
        long[] RoleIds { get; set; }
        string[] RoleNames { get; set; }
        long BusinessProfileId { get; set; }
        string EmailAddress { get; set; }
        string PhoneNumber { get; set; }
        string MobileNumber { get; set; }
        string Gender { get; set; }
        string ImageSource { get; set; }
        bool IsDefaultBusinessProfile { get; set; }
        bool IsSystemAdmin { get; set; }        
    }
}
