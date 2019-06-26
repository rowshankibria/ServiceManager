using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class BranchModel
    {
        public long Id { get; set; }
        public string BranchCode { get; set; }
        public string BranchName { get; set; }
        public long? CompanyId { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string ContactPerson { set; get; }
    }
}
