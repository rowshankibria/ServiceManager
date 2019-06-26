using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class EmailHistory
    {
        public long Id { get; set; }
        public long EntityTypeId { get; set; }
        public long EntityId { get; set; }
        public string EmailSender { get; set; }
        public string EmailReceiver { get; set; }
        public string Subject { get; set; }
        public string EmailContent { get; set; }
        public long CreatedByContactId { get; set; }
        public DateTime DateCreated { get; set; }
        public byte[] TimeStamp { get; set; }

        public Contact CreatedByContact { get; set; }
        public EntityType EntityType { get; set; }
    }
}
