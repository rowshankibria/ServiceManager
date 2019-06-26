using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class ApplicationCustomField
    {
        public long Id { get; set; }
        public long LoanApplicationId { get; set; }
        public long CustomFieldMasterId { get; set; }
        public string Value { get; set; }
        public long? ValueOptionId { get; set; }
        public bool IsOnlySingleValue { get; set; }

        public CustomFieldMaster CustomFieldMaster { get; set; }
        public LoanApplication LoanApplication { get; set; }
        public CustomFieldControlValueOption ValueOption { get; set; }
    }
}
