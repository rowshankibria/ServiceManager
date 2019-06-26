using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class DocumentExtension
    {
        public long Id { get; set; }
        public string Extension { get; set; }
        public string Description { get; set; }
        public bool Allowed { get; set; }
        public byte[] TimeStamp { get; set; }
    }
}
