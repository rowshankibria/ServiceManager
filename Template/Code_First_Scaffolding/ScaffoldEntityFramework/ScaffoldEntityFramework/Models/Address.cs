using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class Address
    {
        public Address()
        {
            EntityAddressLists = new HashSet<EntityAddressList>();
        }

        public long Id { get; set; }
        public long? TypeId { get; set; }
        public string Street { get; set; }
        public string Suburb { get; set; }
        public long? StateId { get; set; }
        public string PostCode { get; set; }
        public long? CountryId { get; set; }
        public byte[] TimeStamp { get; set; }
        public bool? IsActive { get; set; }

        public Country Country { get; set; }
        public State State { get; set; }
        public CustomCategory Type { get; set; }
        public ICollection<EntityAddressList> EntityAddressLists { get; set; }
    }
}
