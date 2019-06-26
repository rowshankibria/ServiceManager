using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class ApprovalProcess
    {
        public ApprovalProcess()
        {
            ApprovalEntityMappings = new HashSet<ApprovalEntityMapping>();
            ApprovalProcessSteps = new HashSet<ApprovalProcessStep>();
            LoanTypeApprovalProcesses = new HashSet<LoanTypeApprovalProcess>();
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsDefault { get; set; }
        public bool IsCreditOperationNeeded { get; set; }
        public bool IsRiskLegalNeeded { get; set; }
        

        public ICollection<ApprovalEntityMapping> ApprovalEntityMappings { get; set; }
        public ICollection<ApprovalProcessStep> ApprovalProcessSteps { get; set; }
        public ICollection<LoanTypeApprovalProcess> LoanTypeApprovalProcesses { get; set; }
    }
}
