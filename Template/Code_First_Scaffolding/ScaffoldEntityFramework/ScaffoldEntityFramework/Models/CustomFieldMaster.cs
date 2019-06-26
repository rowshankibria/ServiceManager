using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class CustomFieldMaster
    {
        public CustomFieldMaster()
        {
            ApplicationCustomFields = new HashSet<ApplicationCustomField>();
            CustomFieldControlValueOptions = new HashSet<CustomFieldControlValueOption>();
            CustomFieldValidations = new HashSet<CustomFieldValidation>();
        }

        public long Id { get; set; }
        public long EntityTypeId { get; set; }
        public long EntityId { get; set; }
        public string GroupName { get; set; }
        public string Name { get; set; }
        public string Caption { get; set; }
        public long ControlTypeId { get; set; }
        public bool? IsMandatory { get; set; }
        public string ControlsOptionValue { get; set; }
        public int GroupSortOrder { get; set; }
        public int ControlSortOrder { get; set; }

        public BusinessCategory ControlType { get; set; }
        public LoanType Entity { get; set; }
        public EntityType EntityType { get; set; }
        public ICollection<ApplicationCustomField> ApplicationCustomFields { get; set; }
        public ICollection<CustomFieldControlValueOption> CustomFieldControlValueOptions { get; set; }
        public ICollection<CustomFieldValidation> CustomFieldValidations { get; set; }
    }
}
