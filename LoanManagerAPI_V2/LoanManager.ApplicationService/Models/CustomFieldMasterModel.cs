using LoanManager.Data.Models;
using LoanManager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class CustomFieldMasterModel
    {
        public CustomFieldMasterModel()
        {
            //ApplicationCustomFields = new HashSet<ApplicationCustomField>();
            //CustomFieldControlValueOptions = new HashSet<CustomFieldControlValueOption>();
            //CustomFieldValidations = new HashSet<CustomFieldValidation>();
        }

        public long Id { get; set; }
        public long EntityTypeId { get; set; }
        public long EntityId { get; set; }
        public string Name { get; set; }
        public string Caption { get; set; }
        public long ControlTypeId { get; set; }
        public bool? IsMandatory { get; set; }
        public string GroupName { get; set; }
        public string ControlsOptionValue { get; set; }

        public List<SelectModel> ControlSelectedItem => this.GetSelectedItems(); 

        public List<SelectModel> GetSelectedItems()
        {
            string selectedValue = this.ControlsOptionValue;
            List<string> valueList = selectedValue.Split(',').ToList<string>();
            if(valueList.Count > 0)
                return valueList.Select(x => new SelectModel { Id = x, Name = x }).ToList();

            return new List<SelectModel>();
        }

        //public BusinessCategory ControlType { get; set; }
        //public LoanType Entity { get; set; }
        //public EntityType EntityType { get; set; }
        //public ICollection<ApplicationCustomField> ApplicationCustomFields { get; set; }
        //public ICollection<CustomFieldControlValueOption> CustomFieldControlValueOptions { get; set; }
        //public ICollection<CustomFieldValidation> CustomFieldValidations { get; set; }
    }
}
