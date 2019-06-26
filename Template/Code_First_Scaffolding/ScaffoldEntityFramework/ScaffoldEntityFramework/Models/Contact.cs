using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class Contact
    {
        public Contact()
        {
            ApprovalEntityMappings = new HashSet<ApprovalEntityMapping>();
            CompanyCreatedByContacts = new HashSet<Company>();
            CompanyLastUpdatedByContacts = new HashSet<Company>();
            CompanyPrimaryContacts = new HashSet<Company>();
            EmailHistories = new HashSet<EmailHistory>();
            Employees = new HashSet<Employee>();
            LoanApplications = new HashSet<LoanApplication>();
            Notes = new HashSet<Note>();
            SystemUserContacts = new HashSet<SystemUser>();
            SystemUserCreatedByContacts = new HashSet<SystemUser>();
        }

        public long Id { get; set; }
        public int ContactType { get; set; }
        public long? TitleId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public long? GenderId { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public long? PostionId { get; set; }
        public string BusinessPhone { get; set; }
        public string HomePhone { get; set; }
        public string Mobile { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public long? ImTypeId { get; set; }
        public string ImLoginId { get; set; }
        public long? PhotoId { get; set; }
        public string CitizenNo { get; set; }
        public long? CitizenIssueDistrictId { get; set; }
        public string CitizenIssueDistrictName { get; set; }
        public DateTime? CitizenIssueDate { get; set; }
        public string VoterCertificateNo { get; set; }
        public long? VoterCertificateIssueDistrictId { get; set; }
        public string VoterCertificateIssueDistrictName { get; set; }
        public DateTime? VoterCertificateIssueDate { get; set; }
        public string DrivingLicenseNo { get; set; }
        public long? DrivingLicenseIssueDistrictId { get; set; }
        public string DrivingLicenseIssueDistrictName { get; set; }
        public DateTime? DrivingLicenseIssueDate { get; set; }
        public string PassportNo { get; set; }
        public long? PassportIssueCountryId { get; set; }
        public string PassportIssueCountryName { get; set; }
        public DateTime? PassportIssueDate { get; set; }
        public string PermanentDistrict { get; set; }
        public string PermanentMunicipality { get; set; }
        public string PermanentWardNo { get; set; }
        public string PermanentTole { get; set; }
        public string PermanentHouseNo { get; set; }
        public string PresentDistrict { get; set; }
        public string PresentMunicipality { get; set; }
        public string PresentWardNo { get; set; }
        public string PresentTole { get; set; }
        public string PresentHouseNo { get; set; }
        public bool IsActive { get; set; }
        public byte[] TimeStamp { get; set; }
        public string Description { get; set; }
        public bool IsArchived { get; set; }
        public long? PreferredContactMethodId { get; set; }
        public string Website { get; set; }
        public string PreferredName { get; set; }
        public int? PreferredPhoneType { get; set; }
        public string TimeZoneId { get; set; }
        public string Email2 { get; set; }
        public string Email3 { get; set; }
        public string EmergencyContactName { get; set; }
        public string EmergencyContactRelation { get; set; }
        public string EmergencyContactNumber { get; set; }
        public string SpecialInstruction { get; set; }
        public string EmergencyContactEmail { get; set; }
        public bool? IsPrimaryContact { get; set; }
        public long? PostingZoneId { get; set; }
        public long? BranchId { get; set; }
        public long? BusinessProfileId { get; set; }
        public long? CompanyId { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public long? CreatedByContactId { get; set; }
        public DateTime? LastUpdatedDateTime { get; set; }
        public long? LastUpdatedByContactId { get; set; }

        public Branch Branch { get; set; }
        public BusinessProfile BusinessProfile { get; set; }
        public Company Company { get; set; }
        public CustomCategory Gender { get; set; }
        public CustomCategory ImType { get; set; }
        public Photo Photo { get; set; }
        public BusinessCategory PostingZone { get; set; }
        public CustomCategory Postion { get; set; }
        public CustomCategory PreferredContactMethod { get; set; }
        public CustomCategory Title { get; set; }
        public ICollection<ApprovalEntityMapping> ApprovalEntityMappings { get; set; }
        public ICollection<Company> CompanyCreatedByContacts { get; set; }
        public ICollection<Company> CompanyLastUpdatedByContacts { get; set; }
        public ICollection<Company> CompanyPrimaryContacts { get; set; }
        public ICollection<EmailHistory> EmailHistories { get; set; }
        public ICollection<Employee> Employees { get; set; }
        public ICollection<LoanApplication> LoanApplications { get; set; }
        public ICollection<Note> Notes { get; set; }
        public ICollection<SystemUser> SystemUserContacts { get; set; }
        public ICollection<SystemUser> SystemUserCreatedByContacts { get; set; }
    }
}
