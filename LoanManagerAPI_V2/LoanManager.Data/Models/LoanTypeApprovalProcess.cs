using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class LoanTypeApprovalProcess
    {
        public long Id { get; set; }
        public long LoanTypeId { get; set; }
        public long ApprovalProcessId { get; set; }

        public ApprovalProcess ApprovalProcess { get; set; }
        public LoanType LoanType { get; set; }
    }
}
