using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class SecurityConfiguration
    {
        public long Id { get; set; }
        public long? BusinessProfileId { get; set; }
        public int? MaximumImageUploadSizeInKb { get; set; }
        public bool EnableDataAuditLog { get; set; }
        public bool EnableErrorLog { get; set; }
        public bool? EnableSessionLog { get; set; }
        public bool EnableAuthenticationLog { get; set; }
        public bool EnableCaptcha { get; set; }
        public bool EnableSso { get; set; }
        public byte[] TimeStamp { get; set; }

        public BusinessProfile BusinessProfile { get; set; }
    }
}
