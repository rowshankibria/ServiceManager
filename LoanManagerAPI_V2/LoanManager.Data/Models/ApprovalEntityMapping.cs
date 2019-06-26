using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class ApprovalEntityMapping
    {
        public ApprovalEntityMapping()
        {
            ApprovalEntityMappingChecklists = new HashSet<ApprovalEntityMappingChecklist>();
        }

        public long Id { get; set; }
        public long EntityType { get; set; }
        public long ApplicationId { get; set; }
        public long ApprovalProcessId { get; set; }
        public long ApprovalProcessStepId { get; set; }
        public string EntityName { get; set; }
        public string Description { get; set; }
        public long? NextApproverGroupId { get; set; }
        public long StatusId { get; set; }
        public int ApprovalSortOrder { get; set; }
        public int NoOfRequestedApproval { get; set; }
        public bool IsFinalApproved { get; set; }
        public DateTime? LastActionDate { get; set; }
        public long? LastActionBy { get; set; }

        public bool IsCreditOperationNeeded { get; set; }
        public bool IsRiskLegalNeeded { get; set; }
        public bool IsSubmittedForCreditOperation { get; set; }
        public bool IsSubmittedForRiskLegal { get; set; }
        public bool IsClearedFromCreditOperation { get; set; }
        public bool IsClearedFromRiskLegal { get; set; }
        public long? ApproverGroupId { get; set; }
        public bool IsSubmittedAction { get; set; }

        public ApproverGroup ApproverGroup { get; set; }
        public LoanApplication Application { get; set; }
        public BusinessCategory Status { get; set; }
        public ApprovalProcess ApprovalProcess { get; set; }
        public ApprovalProcessStep ApprovalProcessStep { get; set; }
        public Contact LastActionByNavigation { get; set; }
        public ICollection<ApprovalEntityMappingChecklist> ApprovalEntityMappingChecklists { get; set; }
    }
}
