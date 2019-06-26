using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class Department
    {
        public Department()
        {
            
        }

        public long Id { get; set; }
        public string DepartmentName { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public byte[] TimeStamp { get; set; }
        public long? BusinessProfileId { get; set; }

    }
}
