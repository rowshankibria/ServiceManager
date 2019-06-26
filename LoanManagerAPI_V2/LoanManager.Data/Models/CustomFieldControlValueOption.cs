using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class CustomFieldControlValueOption
    {
        public CustomFieldControlValueOption()
        {
            ApplicationCustomFields = new HashSet<ApplicationCustomField>();
        }

        public long Id { get; set; }
        public long CustomFieldMasterId { get; set; }
        public string CustomFieldValueOption { get; set; }

        public CustomFieldMaster CustomFieldMaster { get; set; }
        public ICollection<ApplicationCustomField> ApplicationCustomFields { get; set; }
    }
}
