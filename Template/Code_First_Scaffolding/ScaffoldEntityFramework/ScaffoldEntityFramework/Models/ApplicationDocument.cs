using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class ApplicationDocument
    {
        public long Id { get; set; }
        public long DocumentId { get; set; }
        public long ApplicationId { get; set; }

        public LoanApplication Application { get; set; }
        public Document Document { get; set; }
    }
}
