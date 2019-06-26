using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using LoanManager.ApplicationService.Models;
using LoanManager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
    public interface IBranchService
    {
        Task<LoadResult> GetDevexBranchesAsynch(DataSourceLoadOptionsBase options);  
        Task<BranchModel> GetEntityAsync(long id);  
        Task<long> SaveEntityAsync(BranchModel branchModel);
        Task<bool> DeleteEntityAsync(long id);
        Task<bool> DeleteEntitiesAsync(List<long> ids);        
    }
}
