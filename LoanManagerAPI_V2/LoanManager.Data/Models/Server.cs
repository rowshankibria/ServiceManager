using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class Server
    {
        public long Id { get; set; }
        public string DisplayName { get; set; }
        public long ProtocolId { get; set; }
        public int ServerType { get; set; }
        public string OutgoingServer { get; set; }
        public int OutgoingPort { get; set; }
        public string SenderName { get; set; }
        public string SenderId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public long AuthenticationTypeId { get; set; }
        public long SenderOptionId { get; set; }
        public bool UseSslforOutgoing { get; set; }
        public string ReplyToEmailAddress { get; set; }
        public string CopyToEmailAddress { get; set; }
        public bool IsDefault { get; set; }
        public byte[] TimeStamp { get; set; }
        public long BusinessProfileId { get; set; }

        public BusinessCategory AuthenticationType { get; set; }
        public BusinessProfile BusinessProfile { get; set; }
        public BusinessCategory Protocol { get; set; }
        public BusinessCategory SenderOption { get; set; }
    }
}
