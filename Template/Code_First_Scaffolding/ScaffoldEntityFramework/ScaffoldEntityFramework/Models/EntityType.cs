using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class EntityType
    {
        public EntityType()
        {
            CustomFieldMasters = new HashSet<CustomFieldMaster>();
            EmailHistories = new HashSet<EmailHistory>();
            EntityAddressLists = new HashSet<EntityAddressList>();
            Notes = new HashSet<Note>();
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsInternal { get; set; }

        public ICollection<CustomFieldMaster> CustomFieldMasters { get; set; }
        public ICollection<EmailHistory> EmailHistories { get; set; }
        public ICollection<EntityAddressList> EntityAddressLists { get; set; }
        public ICollection<Note> Notes { get; set; }
    }
}
