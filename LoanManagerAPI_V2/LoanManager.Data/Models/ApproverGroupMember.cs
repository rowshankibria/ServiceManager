using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class ApproverGroupMember
    {
        public long Id { get; set; }
        public long ApprovalGroupId { get; set; }
        public long EmployeeId { get; set; }

        public ApproverGroup ApprovalGroup { get; set; }
        public Employee Employee { get; set; }
    }
}
