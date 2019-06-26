using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Data.StoredProcedureModel
{
    public class LoanApplicationBranchSummary
    {
        //public int Id { get; set; }
        public string BranchName { get; set; }
        public int NumberOfApplication { get; set; }
    }
}
