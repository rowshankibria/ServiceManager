using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class Photo
    {
        public Photo()
        {
            BusinessProfiles = new HashSet<BusinessProfile>();
            Companies = new HashSet<Company>();
            Contacts = new HashSet<Contact>();
        }

        public long Id { get; set; }
        public string FileName { get; set; }
        public string OrginalFileName { get; set; }
        public byte[] PhotoThumb { get; set; }
        public bool IsDefault { get; set; }
        public bool IsVisibleInPublicPortal { get; set; }
        public int? DisplayOrder { get; set; }
        public string Description { get; set; }
        public int? FileSizeInKb { get; set; }
        public byte[] TimeStamp { get; set; }

        public ICollection<BusinessProfile> BusinessProfiles { get; set; }
        public ICollection<Company> Companies { get; set; }
        public ICollection<Contact> Contacts { get; set; }
    }
}
