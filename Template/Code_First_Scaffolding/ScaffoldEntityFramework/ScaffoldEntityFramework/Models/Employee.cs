using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class Employee
    {
        public Employee()
        {
            ApproverGroupMembers = new HashSet<ApproverGroupMember>();
            InverseSupervisor = new HashSet<Employee>();
            LoanApplicationAssignedEmployees = new HashSet<LoanApplication>();
            LoanApplicationCurrentAssignedEmployees = new HashSet<LoanApplication>();
            NoteAssignedByEmployees = new HashSet<Note>();
            NoteAssignedToEmployees = new HashSet<Note>();
        }

        public long Id { get; set; }
        public string EmployeeId { get; set; }
        public long ContactId { get; set; }
        public long? EmploymentTypeId { get; set; }
        public DateTime? CommenceDate { get; set; }
        public DateTime? ProbitionEndingDate { get; set; }
        public string JobDescription { get; set; }
        public string Floor { get; set; }
        public long? DepartmentId { get; set; }
        public string DeskId { get; set; }
        public long? SupervisorId { get; set; }
        public DateTime? JobCeasedDate { get; set; }
        public string ReasonJobCeased { get; set; }
        public DateTime? VisaExpiryDate { get; set; }
        public bool IsActive { get; set; }
        public byte[] TimeStamp { get; set; }
        public bool IsArchived { get; set; }

        public Contact Contact { get; set; }
        public CustomCategory Department { get; set; }
        public CustomCategory EmploymentType { get; set; }
        public Employee Supervisor { get; set; }
        public ICollection<ApproverGroupMember> ApproverGroupMembers { get; set; }
        public ICollection<Employee> InverseSupervisor { get; set; }
        public ICollection<LoanApplication> LoanApplicationAssignedEmployees { get; set; }
        public ICollection<LoanApplication> LoanApplicationCurrentAssignedEmployees { get; set; }
        public ICollection<Note> NoteAssignedByEmployees { get; set; }
        public ICollection<Note> NoteAssignedToEmployees { get; set; }
    }
}
