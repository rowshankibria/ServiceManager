using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class ApprovalEntityMappingChecklist
    {
        public long Id { get; set; }
        public long ApprovalEntityMappingId { get; set; }
        public long? ApproverGroupId { get; set; }
        public long ApprovalProcessStepChecklistId { get; set; }
        public string Title { get; set; }
        public bool IsSubmitted { get; set; }

        public ApprovalEntityMapping ApprovalEntityMapping { get; set; }
        public ApprovalProcessStepChecklist ApprovalProcessStepChecklist { get; set; }
        public ApproverGroup ApproverGroup { get; set; }
    }
}
