using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class ApplicationPageNavigation
    {
        public long Id { get; set; }
        public long PageId { get; set; }
        public string LinkName { get; set; }
        public string NavigateUrl { get; set; }

        public ApplicationPage Page { get; set; }
    }
}
