using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class BusinessProfile
    {
        public BusinessProfile()
        {
            Companies = new HashSet<Company>();
            Configurations = new HashSet<Configuration>();
            Contacts = new HashSet<Contact>();
            SecurityConfigurations = new HashSet<SecurityConfiguration>();
            Servers = new HashSet<Server>();
        }

        public long Id { get; set; }
        public string CompanyName { get; set; }
        public string Number { get; set; }
        public string Abn { get; set; }
        public string Acn { get; set; }
        public string Phone { get; set; }
        public string SecondaryPhone { get; set; }
        public string Mobile { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string SecondaryEmail { get; set; }
        public string Website { get; set; }
        public bool UseRegion { get; set; }
        public long? LogoId { get; set; }
        public bool EnableMultipleOperatingCountries { get; set; }
        public bool EnableMultipleOperatingStates { get; set; }
        public byte[] SchedulerObject { get; set; }
        public byte[] AccountingIntegrationConfiguration { get; set; }
        public byte[] PayrollIntegrationConfiguration { get; set; }
        public bool? UseSameConfigForPayrollIntegration { get; set; }
        public bool DisableViewCustomisation { get; set; }
        public bool DisableConcurrencyWarning { get; set; }
        public bool DisableUnsavedPrompt { get; set; }
        public bool AllowAccessHours { get; set; }
        public bool IsDefault { get; set; }
        public bool IsActive { get; set; }
        public byte[] TimeStamp { get; set; }
        public string TimeZoneId { get; set; }
        public bool DisableEmail { get; set; }
        public string ApplicationUrl { get; set; }
        public DateTime? CreatedDateTime { get; set; }
        public long? CreatedByContactId { get; set; }
        public DateTime? LastUpdatedDateTime { get; set; }
        public long? LastUpdatedByContactId { get; set; }
        public string Street { get; set; }
        public string Suburb { get; set; }
        public string PostalCode { get; set; }
        public long? CountryId { get; set; }

        public Country Country { get; set; }
        public Photo Logo { get; set; }
        public ICollection<Company> Companies { get; set; }
        public ICollection<Configuration> Configurations { get; set; }
        public ICollection<Contact> Contacts { get; set; }
        public ICollection<SecurityConfiguration> SecurityConfigurations { get; set; }
        public ICollection<Server> Servers { get; set; }
    }
}
