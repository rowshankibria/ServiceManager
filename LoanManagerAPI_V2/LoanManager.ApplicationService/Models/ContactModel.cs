using LoanManager.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class ContactModel
    {
        public ContactModel()
        {
            this.Photo = new PhotoModel();           
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
        public DateTime? CitizenIssueDate { get; set; }
        public string VoterCertificateNo { get; set; }
        public long? VoterCertificateIssueDistrictId { get; set; }
        public DateTime? VoterCertificateIssueDate { get; set; }
        public string DrivingLicenseNo { get; set; }
        public long? DrivingLicenseIssueDistrictId { get; set; }
        public DateTime? DrivingLicenseIssueDate { get; set; }
        public string PassportNo { get; set; }
        public long? PassportIssueCountryId { get; set; }
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
        public long? CompanyId { get; set; }

        public long? PostingZoneId { get; set; }
        public long? BranchId { get; set; }
        public long? BusinessProfileId { get; set; }

        public DateTime CreatedDateTime { get; set; }
        public long CreatedByContactId { get; set; }
        public DateTime? LastUpdatedDateTime { get; set; }
        public long? LastUpdatedByContactId { get; set; }

        public Company Company { get; set; }
        public CustomCategory Gender { get; set; }
        public CustomCategory ImType { get; set; }        
        public CustomCategory Postion { get; set; }
        public CustomCategory PreferredContactMethod { get; set; }
        public CustomCategory Title { get; set; }
        public PhotoModel Photo { get; set; } 
        public string DisplayName { get { return $"{FirstName} {LastName}"; } }  
    }
}
