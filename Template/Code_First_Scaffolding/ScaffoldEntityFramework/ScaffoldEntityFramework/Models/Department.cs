﻿using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class Department
    {
        public long Id { get; set; }
        public string DepartmentName { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public byte[] TimeStamp { get; set; }
        public long? BusinessProfileId { get; set; }
    }
}
