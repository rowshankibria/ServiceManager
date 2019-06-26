using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class PublicHoliday
    {
        public long Id { get; set; }
        public DateTime Date { get; set; }
        public long CountryId { get; set; }
        public long? StateId { get; set; }
        public string EventName { get; set; }
        public byte[] Timestamp { get; set; }

        public Country Country { get; set; }
        public State State { get; set; }
    }
}
