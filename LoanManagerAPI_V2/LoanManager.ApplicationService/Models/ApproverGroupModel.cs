using LoanManager.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class ApproverGroupModel
    {
        public ApproverGroupModel()
        {
            ApprovalProcessSteps = new HashSet<ApprovalProcessStep>();
            ApproverGroupMembers = new HashSet<ApproverGroupMember>();
            this.EmployeeIds = new List<long>();
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public long? ApproverGroupTypeId { get; set; }
        public string Description { get; set; }
        public BusinessCategory ApproverGroupType { get; set; }
        public List<long> EmployeeIds { get; set; }

        public ICollection<ApprovalProcessStep> ApprovalProcessSteps { get; set; }
        public ICollection<ApproverGroupMember> ApproverGroupMembers { get; set; }
    }
}
