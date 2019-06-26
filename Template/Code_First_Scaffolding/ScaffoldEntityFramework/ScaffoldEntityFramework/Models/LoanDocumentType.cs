using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class LoanDocumentType
    {
        public long Id { get; set; }
        public long LoanTypeId { get; set; }
        public long CategoryTypeId { get; set; }

        public CustomCategory CategoryType { get; set; }
        public LoanType LoanType { get; set; }
    }
}
