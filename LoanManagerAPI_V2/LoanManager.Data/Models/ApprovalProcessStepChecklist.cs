using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class ApprovalProcessStepChecklist
    {
        public ApprovalProcessStepChecklist()
        {
            ApprovalEntityMappingChecklists = new HashSet<ApprovalEntityMappingChecklist>();
        }

        public long Id { get; set; }
        public long ApprovalProcessStepId { get; set; }
        public long DocumentChecklistId { get; set; }

        public ApprovalProcessStep ApprovalProcessStep { get; set; }
        public DocumentChecklist DocumentChecklist { get; set; }
        public ICollection<ApprovalEntityMappingChecklist> ApprovalEntityMappingChecklists { get; set; }
    }
}
