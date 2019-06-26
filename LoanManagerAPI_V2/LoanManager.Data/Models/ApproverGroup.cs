using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class ApproverGroup
    {
        public ApproverGroup()
        {
            ApprovalEntityMappingChecklists = new HashSet<ApprovalEntityMappingChecklist>();
            ApprovalProcessSteps = new HashSet<ApprovalProcessStep>();
            ApproverGroupMembers = new HashSet<ApproverGroupMember>();
            LoanApplications = new HashSet<LoanApplication>();
            ApprovalEntityMappings = new HashSet<ApprovalEntityMapping>();
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public long ApproverGroupTypeId { get; set; }
        public string Description { get; set; }


        public BusinessCategory ApproverGroupType { get; set; }
        public ICollection<ApprovalEntityMappingChecklist> ApprovalEntityMappingChecklists { get; set; }
        public ICollection<ApprovalEntityMapping> ApprovalEntityMappings { get; set; }
        public ICollection<ApprovalProcessStep> ApprovalProcessSteps { get; set; }
        public ICollection<ApproverGroupMember> ApproverGroupMembers { get; set; }
        public ICollection<LoanApplication> LoanApplications { get; set; }
    }
}
