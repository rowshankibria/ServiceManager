using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class FileStore
    {
        public Guid Id { get; set; }
        public byte[] FileContent { get; set; }
        public byte[] TimeStamp { get; set; }
    }
}
