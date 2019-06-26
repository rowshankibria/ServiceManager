using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class ApprovalProcessStep
    {
        public ApprovalProcessStep()
        {
            ApprovalEntityMappings = new HashSet<ApprovalEntityMapping>();
            ApprovalProcessStepChecklists = new HashSet<ApprovalProcessStepChecklist>();
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public long ApprovalProcessId { get; set; }
        public long ApproverGroupId { get; set; }
        public bool IsAcceptApplied { get; set; }
        public bool IsRejectApplied { get; set; }
        public bool IsOverrideApplied { get; set; }
        public bool IsFinalStep { get; set; }
        public int? SortOrder { get; set; }

        public ApprovalProcess ApprovalProcess { get; set; }
        public ApproverGroup ApproverGroup { get; set; }
        public ICollection<ApprovalEntityMapping> ApprovalEntityMappings { get; set; }
        public ICollection<ApprovalProcessStepChecklist> ApprovalProcessStepChecklists { get; set; }
    }
}
