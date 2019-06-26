using LoanManager.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class ApprovalProcessModel
    {
        public ApprovalProcessModel()
        {
            ApprovalEntityMappings = new HashSet<ApprovalEntityMapping>();
            ApprovalProcessSteps = new HashSet<ApprovalProcessStep>();
            LoanTypeApprovalProcesses = new HashSet<LoanTypeApprovalProcess>();
            this.ApprovalStepIds = new List<long>();
            this.DocumentCheckIds = new List<long>();
            this.ApprovalProcessStepCheckList = new List<ApprovalProcessStepChecklist>();
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsDefault { get; set; }
        public bool IsCreditOperationNeeded { get; set; }
        public bool IsRiskLegalNeeded { get; set; }


        public string ApprovalStepName { get; set; }
        public long ApproverGroupId { get; set; }
        public bool IsFinalStep { get; set; }
        public int? SortOrder { get; set; }
        public List<long> ApprovalStepIds { get; set; }
        public List<long> DocumentCheckIds { get; set; }
        public List<ApprovalProcessStepChecklist> ApprovalProcessStepCheckList { get; set; }


        public ICollection<ApprovalEntityMapping> ApprovalEntityMappings { get; set; }
        public ICollection<ApprovalProcessStep> ApprovalProcessSteps { get; set; }
        public ICollection<LoanTypeApprovalProcess> LoanTypeApprovalProcesses { get; set; }
    }
}
