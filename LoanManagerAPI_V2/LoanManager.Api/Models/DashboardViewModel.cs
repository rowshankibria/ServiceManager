using LoanManager.Data.StoredProcedureModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Api.Models
{
    public class DashboardViewModel
    {
        public List<LoanApplicationBranchSummary> BranchSummary { get; set; }
        public List<LoanApplicationSummary> ApplicationSummary { get; set; }
        public LoanApplicationTotalSummary ApplicationTotalModel { get; set; }
    }
}
