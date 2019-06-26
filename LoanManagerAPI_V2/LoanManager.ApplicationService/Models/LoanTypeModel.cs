using LoanManager.Data.Models;
using LoanManager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class LoanTypeModel
    {
        public LoanTypeModel()
        {
            CustomFieldMasters = new HashSet<CustomFieldMaster>();
            LoanApplications = new HashSet<LoanApplication>();
            LoanTypeApprovalProcesses = new HashSet<LoanTypeApprovalProcess>();
            this.CustomFieldModel = new CustomFieldModel();
            this.DocumentCategoryIds = new List<long>();
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal MinimumAmount { get; set; }
        public decimal MaximumAmount { get; set; }


        public long? ApprovalProcessId { get; set; }

        public CustomFieldModel CustomFieldModel { get; set; }

        public ICollection<CustomFieldMaster> CustomFieldMasters { get; set; }
        public ICollection<LoanApplication> LoanApplications { get; set; }
        public ICollection<LoanTypeApprovalProcess> LoanTypeApprovalProcesses { get; set; }
        public ICollection<SelectModel> CustomFieldGroupSelectItems { get; set; }

        public List<long> DocumentCategoryIds { get; set; }
    }
}
