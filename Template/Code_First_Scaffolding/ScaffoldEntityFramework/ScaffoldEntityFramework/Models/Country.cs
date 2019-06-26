using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class Country
    {
        public Country()
        {
            Addresses = new HashSet<Address>();
            BusinessProfiles = new HashSet<BusinessProfile>();
            Companies = new HashSet<Company>();
            PublicHolidays = new HashSet<PublicHoliday>();
            States = new HashSet<State>();
        }

        public long Id { get; set; }
        public string CountryName { get; set; }
        public string CountryCode { get; set; }
        public int? CurrencyId { get; set; }

        public ICollection<Address> Addresses { get; set; }
        public ICollection<BusinessProfile> BusinessProfiles { get; set; }
        public ICollection<Company> Companies { get; set; }
        public ICollection<PublicHoliday> PublicHolidays { get; set; }
        public ICollection<State> States { get; set; }
    }
}
