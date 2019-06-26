using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class EntityType
    {
        public EntityType()
        {
            CustomFieldMasters = new HashSet<CustomFieldMaster>();
            EntityAddressLists = new HashSet<EntityAddressList>();
            Notes = new HashSet<Note>();
            EmailHistories = new HashSet<EmailHistory>();
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsInternal { get; set; }

        public ICollection<CustomFieldMaster> CustomFieldMasters { get; set; }
        public ICollection<EntityAddressList> EntityAddressLists { get; set; }
        public ICollection<Note> Notes { get; set; }
        public ICollection<EmailHistory> EmailHistories { get; set; }
    }
}
