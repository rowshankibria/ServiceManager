using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class LoanType
    {
        public LoanType()
        {
            CustomFieldMasters = new HashSet<CustomFieldMaster>();
            LoanApplications = new HashSet<LoanApplication>();
            LoanDocumentTypes = new HashSet<LoanDocumentType>();
            LoanTypeApprovalProcesses = new HashSet<LoanTypeApprovalProcess>();
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal MinimumAmount { get; set; }
        public decimal MaximumAmount { get; set; }

        public ICollection<CustomFieldMaster> CustomFieldMasters { get; set; }
        public ICollection<LoanApplication> LoanApplications { get; set; }
        public ICollection<LoanDocumentType> LoanDocumentTypes { get; set; }
        public ICollection<LoanTypeApprovalProcess> LoanTypeApprovalProcesses { get; set; }
    }
}
