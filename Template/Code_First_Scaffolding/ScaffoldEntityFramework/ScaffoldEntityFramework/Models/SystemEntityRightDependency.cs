using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class SystemEntityRightDependency
    {
        public int Id { get; set; }
        public long RightId { get; set; }
        public long DependentRightId { get; set; }

        public SystemEntityRight DependentRight { get; set; }
        public SystemEntityRight Right { get; set; }
    }
}
