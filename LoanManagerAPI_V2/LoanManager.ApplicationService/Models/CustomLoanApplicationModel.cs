using LoanManager.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class CustomLoanApplicationModel
    {
        public long Id { get; set; }
        public string ApplicationId { get; set; }
        public string ApplicantName { get; set; }
        public string Gender { get; set; }
        public string BusinessPhone { get; set; }
        public string HomePhone { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string LoanType { get; set; }
        public string Branch { get; set; }
        public DateTime? ApplicationDate { get; set; }
        public decimal? LoanAmount { get; set; }
        public string Status { get; set; }
    }
}
