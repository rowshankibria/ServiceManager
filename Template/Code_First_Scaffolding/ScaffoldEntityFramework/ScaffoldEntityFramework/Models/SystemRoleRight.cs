using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class SystemRoleRight
    {
        public long Id { get; set; }
        public long RoleId { get; set; }
        public long RightId { get; set; }

        public SystemEntityRight Right { get; set; }
        public SystemRole Role { get; set; }
    }
}
