using LoanManager.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class LoanApplicationModel
    {
        public LoanApplicationModel()
        {
            
            this.Contact = new ContactModel();
            ApplicationCustomFields = new List<ApplicationCustomFieldModel>();
            this.CustomFieldGroup = new List<string>();
            //ApplicationDocuments = new HashSet<ApplicationDocument>();
            //ApprovalEntityMappings = new HashSet<ApprovalEntityMapping>();
        }

        public long Id { get; set; }
        public string ApplicationId { get; set; }
        public long? ContactId { get; set; }
        public long? ApplicationStatusId { get; set; }
        public DateTime? ApplicationDate { get; set; }
        public DateTime? ProcessStartDate { get; set; }
        public decimal? RequestedLoanAmount { get; set; }
        public decimal? ApprovedLoanAmount { get; set; }
        public DateTime? DateOfIssue { get; set; }
        public string Description { get; set; }
        public long? LoanTypeId { get; set; }
        public long? BranchId { get; set; }
        public bool IsSubmitted { get; set; }
        public bool IsSubmittedToCreditAdministrator { get; set; }
        public long? AssignedEmployeeId { get; set; }
        public long? CurrentAssignedEmployeeId { get; set; }
        public long? CurrentAssignedEmployeeContactId { get; set; }
        public long LoginUserId { get; set; }
        public long AssignedContactId { get; set; }


        //custom values
        public long LoanStatusMapTypeId { get; set; }
        public long ApprovalMappingId { get; set; }
        public long ApprovalStatusId { get; set; }

        public bool IsCreditOperationNeeded { get; set; }
        public bool IsRiskLegalNeeded { get; set; }
        public bool IsSubmittedForCreditOperation { get; set; }
        public bool IsSubmittedForRiskLegal { get; set; }
        public bool IsClearedFromCreditOperation { get; set; }
        public bool IsClearedFromRiskLegal { get; set; }
        public long ApproverGroupTypeId { get; set; }
        public long CurrentApproverGroupTypeId { get; set; }
        public long LoginUserApproverGroupTypeId { get; set; }
        public string CurrentAssigneeComments { get; set; }
          

        public Employee AssignedEmployee { get; set; }
        public List<ApplicationCustomFieldModel> ApplicationCustomFields { get; set; }
        public List<string> CustomFieldGroup { get; set; }
        //public ICollection<ApplicationDocument> ApplicationDocuments { get; set; }
        //public ICollection<ApprovalEntityMapping> ApprovalEntityMappings { get; set; }

        public ContactModel Contact { get; set; }
      


    }
}
