namespace LoanManager.ApplicationService.Models
{
    public class RoleModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public long? ParentRoleId { get; set; }
        public bool IsActive { get; set; }
        public long[] RoleRights { get; set; }
    }
}
