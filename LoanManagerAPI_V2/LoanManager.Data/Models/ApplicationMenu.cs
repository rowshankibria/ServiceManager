using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class ApplicationMenu
    {
        public ApplicationMenu()
        {
            InverseParent = new HashSet<ApplicationMenu>();
        }

        public long Id { get; set; }
        public string ApplicationName { get; set; }
        public string Name { get; set; }
        public string Caption { get; set; }
        public int RowNo { get; set; }
        public string HelpText { get; set; }
        public long? ParentId { get; set; }
        public long? PageId { get; set; }
        public string ImageSource { get; set; }
        public string NavigateUrl { get; set; }
        public long? EntityId { get; set; }
        public long? EntityRightId { get; set; }
        public bool? IsVisible { get; set; }

        public ApplicationPage Page { get; set; }
        public ApplicationMenu Parent { get; set; }
        public ICollection<ApplicationMenu> InverseParent { get; set; }
    }
}
