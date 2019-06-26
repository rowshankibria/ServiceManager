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
    public interface IApprovalProcessService
    {
        Task<LoadResult> GetDevexApprovalProcessesAsynch(DataSourceLoadOptionsBase options);
        Task<LoadResult> GetApprovalProcessStepByIdAsync(long approvalProcessId, DataSourceLoadOptionsBase options);
        Task<ApprovalProcessModel> GetEntityAsync(long id);
        Task<long> SaveEntityAsync(ApprovalProcessModel approvalProcess);
        Task<bool> DeleteEntityAsync(long id);
        Task<bool> DeleteEntitiesAsync(List<long> ids);
        List<SelectModel> GetApproverGroupAsync();
        List<SelectModel> GetDocumentChecklistAsync();

        Task<bool> MoveUpAsync(long id);
        Task<bool> MoveDownAsync(long id);
        Task<long> SaveApprovalStepAsync(ApprovalProcessModel approvalProcess);
    }
}
