using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using LoanManager.ApplicationService.Models;
using LoanManager.Data.Models;
using LoanManager.Shared;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
    public interface IEmployeeService
    {
        #region Get List
        Task<LoadResult> GetEmployeeListAsync(DataSourceLoadOptionsBase options);
        
        #endregion

        #region Get Single Entity
        List<TabModel> GetEmployeeDetailsTabs(long id);
        Task<EmployeeModel> GetEmployeeByIdAsync(long id);
        #endregion

        #region CUD
        Task<long> SaveEmployeeAsync(long id, EmployeeModel model);
        Task<bool> DeleteEmployeeAsync(long id);
        Task<bool> DeleteEmployeesAsync(List<long> ids);       
        
        #endregion
    }
}
