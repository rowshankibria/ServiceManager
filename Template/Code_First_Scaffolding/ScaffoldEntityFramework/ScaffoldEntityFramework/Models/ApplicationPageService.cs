using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class ApplicationPageService
    {
        public long Id { get; set; }
        public long PageId { get; set; }
        public string ServiceType { get; set; }
        public string ServiceName { get; set; }
        public string ServiceUrl { get; set; }

        public ApplicationPage Page { get; set; }
    }
}
