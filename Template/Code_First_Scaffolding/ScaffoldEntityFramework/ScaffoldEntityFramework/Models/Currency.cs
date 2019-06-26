using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class Currency
    {
        public long Id { get; set; }
        public string Isocode { get; set; }
        public string DisplayName { get; set; }
        public string Symbol { get; set; }
        public int Precision { get; set; }
        public decimal ExchangeRate { get; set; }
        public bool IsBaseCurrency { get; set; }
        public bool? IsActive { get; set; }
        public long? LastUpdatedByContactId { get; set; }
        public DateTime? LastUpdatedOn { get; set; }
        public byte[] TimeStamp { get; set; }
    }
}
