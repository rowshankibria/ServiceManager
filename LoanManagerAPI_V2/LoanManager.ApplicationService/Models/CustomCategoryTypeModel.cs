using LoanManager.Data.Models;
using System;
using System.Collections.Generic;

namespace LoanManager.ApplicationService.Models
{
    public partial class CustomCategoryTypeModel
    {
        public CustomCategoryTypeModel()
        {
            CustomCategories = new HashSet<CustomCategoryModel>();
        }

        public long Id { get; set; }
        public string RoutingKey { get; set; }
        public string ModuleName { get; set; }
        public string Name { get; set; }
        public string HelpText { get; set; }
        public int? RightId { get; set; }
        public int RowNo { get; set; }
        public int? CustomCategoryMapTypeId { get; set; }
        public string ImageSource { get; set; }
        public bool IsMapTypeRequired { get; set; }
        public bool IsMapTypeMappingUnique { get; set; }
        public bool IsInternal { get; set; }        

        public CustomCategoryMapType CustomCategoryMapType { get; set; }
        //public SystemEntityRight Right { get; set; }
        public ICollection<CustomCategoryModel> CustomCategories { get; set; }
    }
}
