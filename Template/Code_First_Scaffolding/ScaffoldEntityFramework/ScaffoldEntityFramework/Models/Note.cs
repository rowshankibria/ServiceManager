using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class Note
    {
        public long Id { get; set; }
        public long EntityTypeId { get; set; }
        public long EntityId { get; set; }
        public string NoteDetail { get; set; }
        public string ResponseDetail { get; set; }
        public long CreatedByContactId { get; set; }
        public DateTime DateCreated { get; set; }
        public bool IsPrivate { get; set; }
        public long? NoteTypeId { get; set; }
        public long? AssignedByEmployeeId { get; set; }
        public long? AssignedToEmployeeId { get; set; }
        public byte[] TimeStamp { get; set; }

        public Employee AssignedByEmployee { get; set; }
        public Employee AssignedToEmployee { get; set; }
        public Contact CreatedByContact { get; set; }
        public EntityType EntityType { get; set; }
        public BusinessCategory NoteType { get; set; }
    }
}
