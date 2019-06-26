using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class SystemEntityRight
    {
        public SystemEntityRight()
        {
            CustomCategoryTypes = new HashSet<CustomCategoryType>();
            SystemEntityRightDependencyDependentRights = new HashSet<SystemEntityRightDependency>();
            SystemEntityRightDependencyRights = new HashSet<SystemEntityRightDependency>();
            SystemRoleRights = new HashSet<SystemRoleRight>();
        }

        public long Id { get; set; }
        public long EntityId { get; set; }
        public string RightKey { get; set; }
        public string Name { get; set; }
        public int RightType { get; set; }
        public string Description { get; set; }
        public bool IsB2bItem { get; set; }
        public int SortOrder { get; set; }
        public bool? IsActive { get; set; }
        public byte[] TimeStamp { get; set; }

        public SystemEntity Entity { get; set; }
        public ICollection<CustomCategoryType> CustomCategoryTypes { get; set; }
        public ICollection<SystemEntityRightDependency> SystemEntityRightDependencyDependentRights { get; set; }
        public ICollection<SystemEntityRightDependency> SystemEntityRightDependencyRights { get; set; }
        public ICollection<SystemRoleRight> SystemRoleRights { get; set; }
    }
}
