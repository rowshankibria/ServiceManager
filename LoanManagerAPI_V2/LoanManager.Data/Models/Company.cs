using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class Company
    {
        public Company()
        {
            Branches = new HashSet<Branch>();
            Contacts = new HashSet<Contact>();
        }

        public long Id { get; set; }
        public string CompanyName { get; set; }
        public string AccountNumber { get; set; }
        public string TradeAs { get; set; }
        public string Abn { get; set; }
        public string Acn { get; set; }
        public string MainPhone { get; set; }
        public string MobilePhone { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string Website { get; set; }
        public long? LogoId { get; set; }
        public long? CountryId { get; set; }
        public bool? IsActive { get; set; }
        public long? IndustryTypeId { get; set; }
        public long? CompanyTypeId { get; set; }
        public long? RatingTypeId { get; set; }
        public int? NoOfEmployee { get; set; }
        public long? PrimaryContactId { get; set; }
        public decimal? AnnualTurnover { get; set; }
        public string Description { get; set; }
        public bool IsArchived { get; set; }
        public long? PreferredContactMethodId { get; set; }
        public long? StateId { get; set; }
        public string TimeZoneId { get; set; }

        public string Street { get; set; }
        public string Suburb { get; set; }
        public string PostCode { get; set; }

        public string ExternalPartnerId { get; set; }
        public byte[] TimeStamp { get; set; }
        public long BusinessProfileId { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public long CreatedByContactId { get; set; }
        public DateTime? LastUpdatedDateTime { get; set; }
        public long? LastUpdatedByContactId { get; set; }

        public BusinessProfile BusinessProfile { get; set; }
        public CustomCategory CompanyType { get; set; }
        public Country Country { get; set; }
        public Contact CreatedByContact { get; set; }
        public CustomCategory IndustryType { get; set; }
        public Contact LastUpdatedByContact { get; set; }
        public Photo Logo { get; set; }
        public CustomCategory PreferredContactMethod { get; set; }
        public Contact PrimaryContact { get; set; }
        public CustomCategory RatingType { get; set; }
        public State State { get; set; }
        public ICollection<Branch> Branches { get; set; }
        public ICollection<Contact> Contacts { get; set; }
    }
}
