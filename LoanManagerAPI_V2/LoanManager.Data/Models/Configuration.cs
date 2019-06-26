using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class Configuration
    {
        public long Id { get; set; }
        public long BusinessProfileId { get; set; }
        public long? ReceiptHeaderAddressId { get; set; }
        public long? PostalAddressId { get; set; }
        public long? DeliveryAddressId { get; set; }
        public bool EnableMultipleOperatingCountries { get; set; }
        public byte[] TimeStamp { get; set; }

        public BusinessProfile BusinessProfile { get; set; }
        public Configuration IdNavigation { get; set; }
        public Configuration InverseIdNavigation { get; set; }
    }
}
