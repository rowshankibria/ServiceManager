using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class DocumentChecklist
    {
        public DocumentChecklist()
        {
            ApprovalProcessStepChecklists = new HashSet<ApprovalProcessStepChecklist>();
        }

        public long Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public ICollection<ApprovalProcessStepChecklist> ApprovalProcessStepChecklists { get; set; }
    }
}
