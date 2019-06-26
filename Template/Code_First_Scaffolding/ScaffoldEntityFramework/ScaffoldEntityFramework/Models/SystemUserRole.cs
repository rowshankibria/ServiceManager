using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class SystemUserRole
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public long RoleId { get; set; }

        public SystemRole Role { get; set; }
        public SystemUser User { get; set; }
    }
}
