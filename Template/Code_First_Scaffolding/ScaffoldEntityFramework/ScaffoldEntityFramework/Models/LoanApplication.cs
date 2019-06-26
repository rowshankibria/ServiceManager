using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class LoanApplication
    {
        public LoanApplication()
        {
            ApplicationCustomFields = new HashSet<ApplicationCustomField>();
            ApplicationDocuments = new HashSet<ApplicationDocument>();
            ApprovalEntityMappings = new HashSet<ApprovalEntityMapping>();
            Documents = new HashSet<Document>();
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
        public long? ApproverCurrentGroupId { get; set; }
        public long? AssignedEmployeeId { get; set; }
        public long? CurrentAssignedEmployeeId { get; set; }
        public bool IsSubmitted { get; set; }
        public bool IsSubmittedToCreditAdministrator { get; set; }
        public byte[] TimeStamp { get; set; }

        public CustomCategory ApplicationStatus { get; set; }
        public ApproverGroup ApproverCurrentGroup { get; set; }
        public Employee AssignedEmployee { get; set; }
        public Branch Branch { get; set; }
        public Contact Contact { get; set; }
        public Employee CurrentAssignedEmployee { get; set; }
        public LoanType LoanType { get; set; }
        public ICollection<ApplicationCustomField> ApplicationCustomFields { get; set; }
        public ICollection<ApplicationDocument> ApplicationDocuments { get; set; }
        public ICollection<ApprovalEntityMapping> ApprovalEntityMappings { get; set; }
        public ICollection<Document> Documents { get; set; }
    }
}
