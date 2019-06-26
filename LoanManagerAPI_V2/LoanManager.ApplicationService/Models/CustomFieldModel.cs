using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class CustomFieldModel
    {
        public long Id { get; set; }
        public string CustomFieldName { get; set; }
        public string CustomFieldCaption { get; set; }
        public long CustomFieldControlTypeId { get; set; }
        public bool IsCustomFieldMandatory { get; set; }
        public string CustomFieldGroupName { get; set; }
        public string CustomFieldSelectionValue { get; set; }
        public int GroupSortOrder { get; set; }        
        public int ControlSortOrder { get; set; }
        
    }
}
