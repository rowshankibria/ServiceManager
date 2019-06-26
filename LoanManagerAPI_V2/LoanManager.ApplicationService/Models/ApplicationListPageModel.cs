using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class ApplicationListPageModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string RoutingUrl { get; set; }
        public string Title { get; set; }
        public string PageType { get; set; }

        public dynamic Fields { get; set; }
        public dynamic PageNavigationUrls { get; set; }
        public dynamic PageServiceUrls { get; set; }

    }
}
