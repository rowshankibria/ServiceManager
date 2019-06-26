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
    public interface IApproverGroupService
    {
        Task<LoadResult> GetDevexApproverGroupsAsynch(DataSourceLoadOptionsBase options);        
        Task<ApproverGroupModel> GetEntityAsync(long id);
        Task<long> SaveEntityAsync(ApproverGroupModel approverModel);
        Task<bool> DeleteEntityAsync(long id);
        Task<bool> DeleteEntitiesAsync(List<long> ids);
        List<SelectModel> GetEmployeeItemsAsync(long entityType);
        List<SelectModel> GetCreditOfficerEmployeeItemsAsync();
    }
}
