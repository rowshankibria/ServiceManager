using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class ApplicationPage
    {
        public ApplicationPage()
        {
            ApplicationMenus = new HashSet<ApplicationMenu>();
            ApplicationPageFieldDetails = new HashSet<ApplicationPageFieldDetail>();
            ApplicationPageNavigations = new HashSet<ApplicationPageNavigation>();
            ApplicationPageServices = new HashSet<ApplicationPageService>();
            InverseParent = new HashSet<ApplicationPage>();
        }

        public long Id { get; set; }
        public long? ParentId { get; set; }
        public string Name { get; set; }
        public string RoutingUrl { get; set; }
        public string Title { get; set; }
        public string PageType { get; set; }

        public ApplicationPage Parent { get; set; }
        public ICollection<ApplicationMenu> ApplicationMenus { get; set; }
        public ICollection<ApplicationPageFieldDetail> ApplicationPageFieldDetails { get; set; }
        public ICollection<ApplicationPageNavigation> ApplicationPageNavigations { get; set; }
        public ICollection<ApplicationPageService> ApplicationPageServices { get; set; }
        public ICollection<ApplicationPage> InverseParent { get; set; }
    }
}
