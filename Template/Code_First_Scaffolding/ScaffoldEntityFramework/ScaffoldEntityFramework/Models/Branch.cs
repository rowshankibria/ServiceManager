using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class Branch
    {
        public Branch()
        {
            Contacts = new HashSet<Contact>();
            LoanApplications = new HashSet<LoanApplication>();
        }

        public long Id { get; set; }
        public string BranchCode { get; set; }
        public string BranchName { get; set; }
        public long? CompanyId { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string ContactPerson { get; set; }

        public Company Company { get; set; }
        public ICollection<Contact> Contacts { get; set; }
        public ICollection<LoanApplication> LoanApplications { get; set; }
    }
}
