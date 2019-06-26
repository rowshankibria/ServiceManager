using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class CustomCategoryModel
    {
        public long Id { get; set; }
        [Required(ErrorMessage = "Custom Category is required")]
        [Range(1, long.MaxValue, ErrorMessage = "Invalid custom category")]
        public long CustomCategoryTypeId { get; set; }
        public long? CustomCategoryMapTypeOptionId { get; set; }
        [Required(AllowEmptyStrings = false, ErrorMessage = "Name is required")]
        [MaxLength(100, ErrorMessage = "Maximum length of name is 100 characters.")]
        public string Name { get; set; }
        [MaxLength(100, ErrorMessage = "Maximum length of description is 400 characters.")]
        public string Desciption { get; set; }
        public bool IsDefault { get; set; }
        public bool IsActive { get; set; } = true;
        public int DisplayOrder { get; set; }     
        [MaxLength(4, ErrorMessage = "Maximum length of code is 4 characters.")]
        public string Code { get; set; }
    }
}
