using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class CustomFieldValidation
    {
        public long Id { get; set; }
        public long CustomFieldMasterId { get; set; }
        public long ValidationTypeId { get; set; }
        public string ValidationErrorMessage { get; set; }

        public CustomFieldMaster CustomFieldMaster { get; set; }
        public BusinessCategory ValidationType { get; set; }
    }
}
