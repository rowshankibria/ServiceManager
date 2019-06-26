using LoanManager.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class ApplicationCustomFieldModel
    {
        public long Id { get; set; }
        public long LoanApplicationId { get; set; }
        public long CustomFieldMasterId { get; set; }
        public string Value { get; set; }
        public long? ValueOptionId { get; set; }
        public bool IsOnlySingleValue { get; set; }

        public CustomFieldMasterModel CustomFieldMaster { get; set; }
        //public LoanApplication LoanApplication { get; set; }
        //public CustomFieldControlValueOption ValueOption { get; set; }
    }
}
