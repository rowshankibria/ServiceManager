using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class ApprovalEntityMappingChecklist
    {
        public long Id { get; set; }
        public long ApprovalEntityMappingId { get; set; }
        public long ApprovalProcessStepChecklistId { get; set; }
        public bool IsSubmitted { get; set; }
        public long? ApproverGroupId { get; set; }
        public string Title { get; set; }

        public ApproverGroup ApproverGroup { get; set; }
        public ApprovalEntityMapping ApprovalEntityMapping { get; set; }
        public ApprovalProcessStepChecklist ApprovalProcessStepChecklistNavigation { get; set; }
    }
}
