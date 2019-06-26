using LoanManager.Data.Models;
using LoanManager.Data.StoredProcedureModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Data
{
    public interface IStoredProcedureRepository : IRepository<object>
    {
        List<Company> GetCompanies();
        List<LoanApplicationSummary> GetLoanApplicationSummary();
        List<LoanApplicationBranchSummary> GetLoanApplicationBranchSummary();
        List<LoanApplicationTotalSummary> GetLoanApplicationTotalSummary();
        DeleteValidationSummary GetValidationSummary(int deletableEntityType, long id);
    }
}
