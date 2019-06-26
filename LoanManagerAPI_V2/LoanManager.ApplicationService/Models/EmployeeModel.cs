using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LoanManager.ApplicationService.Models;
using LoanManager.Configuration;

namespace LoanManager.ApplicationService.Models
{
    public class EmployeeModel
    {
        public EmployeeModel()
        {
            Contact = new ContactModel();
        }    

        public long Id { get; set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(50, ErrorMessage = "Maximum length of employee id is 50 characters.")]
        public string EmployeeId { get; set; }

        [MaxLength(400, ErrorMessage = "Maximum length of job description is 400 characters.")]
        public string JobDescription { get; set; }

        [MaxLength(100, ErrorMessage = "Maximum length of floor is 100 characters.")]
        public string Floor { get; set; }

        [MaxLength(50, ErrorMessage = "Maximum length of desk id is 50 characters.")]
        public string DeskId { get; set; }

        [MaxLength(400, ErrorMessage = "Maximum length of job ceased reason is 400 characters.")]
        public string JobCeasedReason { get; set; }

        [Display(Name = "External Partner Id")]
        [MaxLength(50, ErrorMessage = "Maximum length of external partner id is 50 characters.")]
        public string ExternalPartnerId { get; set; }
       
        public long ContactId { get; set; }
        public long? EmploymentTypeId { get; set; }
        public DateTime? CommenceDate { get; set; }
        public DateTime? ProbitionEndingDate { get; set; }      
     
        public long? DepartmentId { get; set; }     
        public long? SupervisorId { get; set; }
        public DateTime? JobCeasedDate { get; set; }
        public string ReasonJobCeased { get; set; }
        public DateTime? VisaExpiryDate { get; set; }
        public bool IsActive { get; set; }
       

        public ContactModel Contact { get; set; }
      
    }
}
