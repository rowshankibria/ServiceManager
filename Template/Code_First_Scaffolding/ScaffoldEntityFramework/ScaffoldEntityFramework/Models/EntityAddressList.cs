using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class EntityAddressList
    {
        public long Id { get; set; }
        public long AddressId { get; set; }
        public long EntityId { get; set; }
        public long EntityTypeId { get; set; }
        public byte[] TimeStamp { get; set; }

        public Address Address { get; set; }
        public EntityType EntityType { get; set; }
    }
}
