using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using LoanManager.ApplicationService.Models;
using LoanManager.Data.Models;
using LoanManager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
    public interface ILoanTypeService
    {
        Task<LoadResult> GetDevexLoanTypesAsynch(DataSourceLoadOptionsBase options);
        Task<LoadResult> GetDevexLoanTypeCustomFieldsAsync(long loanTypeId, DataSourceLoadOptionsBase options);
        Task<IQueryable> GetLoanTypes();
        Task<LoanTypeModel> GetEntityAsync(long id);
        Task<long> SaveEntityAsync(LoanTypeModel loanTypeModel);
        Task<bool> DeleteEntityAsync(long id);
        Task<bool> DeleteEntitiesAsync(List<long> ids);
        Task<bool> DeleteCustomFieldEntityAsync(long id);
        Task<long> SaveCustomFieldAsync(LoanTypeModel loanTypeModel);
        List<SelectModel> GetApprovalProcessAsync();
        List<SelectModel> GetCustomFieldGroups(long loanTypeId);
        List<CustomFieldModel> GetCustomFieldsByLoanId(long loanTypeId);
        CustomFieldModel GetCustomFieldModelById(long id);
        Task<long> UpdateCustomFieldAsync(LoanTypeModel loanTypeModel);
        Task<long> UpdateGroup(LoanTypeModel loanTypeModel);
        Task<bool> UpdateGroupOrFieldOrder(long loanTypeId, string groupName, long controlId, bool isDown, bool isGroupSort);
    }
}
