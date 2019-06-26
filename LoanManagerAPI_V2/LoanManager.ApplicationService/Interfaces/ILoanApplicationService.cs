using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using LoanManager.ApplicationService.Models;
using LoanManager.Data.Models;
using LoanManager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
    public interface ILoanApplicationService
    {
        Task<IQueryable> GetActiveLoanApplicationsAsync(long contactId);
        Task<List<CustomLoanApplicationModel>> GetActiveCustomLoanApplicationsAsync(long contactId);
        Task<LoadResult> GetDevexActiveLoanApplicationsAsync(DataSourceLoadOptionsBase options);
        Task<LoadResult> GetDevexSubmittedLoanApplicationsAsync(DataSourceLoadOptionsBase options);
        Task<LoanApplicationModel> GetLoanApplicationByIdAsync(long id);
        List<TabModel> GetEntityDetailsTabs(long id);
        Task<long> InsertLoanApplicationValuesAsync(LoanApplicationModel applicationModel);
        Task<long> UpdateLoanApplicationValuesAsync(LoanApplicationModel applicationModel);
        Task<bool> DeleteUsersAsync(List<long> ids);
        Task<bool> DeleteUserByIdAsync(long id);
        string GetNextApplicationID();
        void UpdateCustomFieldValues(LoanApplicationModel applicationModel);
        Task<LoanApplicationModel> GetLoanApplicationByIdForAdminAsync(long id);
        Task<long> MapLoanApplicationToApprovalProcessAsync(long id, long approvalProcessId);
        Task<List<ApprovalEntityMappingChecklist>> GetApprovalEntityMappingChecklistByApplicationId(long applicationId);
        Task<List<ApproverGroup>> GetApprovalGroupByApplicationId(long applicationId);

        Task<bool> AcceptRequest(long entityId, long mappingTableRecordid);
        bool RejectRequest(long entityId, long mappingTableRecordid);
        bool SubmitToCreditAdministrator(long id);
        bool UpdateChecklist(List<ApprovalEntityMappingChecklist> checklist);
        Task<List<NoteModel>> GetNoteByApplicationId(long applicationId, long noteTypeId);
        bool UpdateNotelist(List<NoteModel> noteList, long noteTypeId);
        bool UploadDocument(long applicationId, List<AttachedFileModel> models);
        Task<List<AttachedFileModel>> GetDocumentsByApplicationId(long applicationId);
        Task<DownloadFileModel> DownloadFileAsync(long documentId);
        Task<bool> DeleteLoanApplicationAsync(long id);

        Task<bool> DeleteLoanNotesAsync(long id);

        Task<bool> DeleteLoanDocumentAsync(long id);

        Task<LoanApplicationModel> GetLoanApplicationByIdForAdminNotesAsync(long id);
        Task<List<SelectModel>> GetApprovalProcessAssigneeAsync(long loanApplicationId);
        Task<List<NoteModel>> GetNoteForCurrentAssigneeApplicationId(long applicationId);
        Task<List<SelectModel>> GetDocumentCategoryByApplicationId(long applicationId);
    }
}
