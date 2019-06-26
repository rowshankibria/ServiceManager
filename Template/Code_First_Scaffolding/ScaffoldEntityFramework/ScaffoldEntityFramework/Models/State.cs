using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class State
    {
        public State()
        {
            Addresses = new HashSet<Address>();
            Companies = new HashSet<Company>();
            PublicHolidays = new HashSet<PublicHoliday>();
        }

        public long Id { get; set; }
        public long CountryId { get; set; }
        public string StateName { get; set; }
        public string Description { get; set; }
        public bool IsDefault { get; set; }
        public byte[] TimeStamp { get; set; }

        public Country Country { get; set; }
        public ICollection<Address> Addresses { get; set; }
        public ICollection<Company> Companies { get; set; }
        public ICollection<PublicHoliday> PublicHolidays { get; set; }
    }
}
