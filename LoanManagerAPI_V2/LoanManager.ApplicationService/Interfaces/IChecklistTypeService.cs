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
    public interface IChecklistTypeService
    {
        Task<LoadResult> GetDevexChecklistTypesAsynch(DataSourceLoadOptionsBase options);        
        Task<IQueryable> GetChecklistTypes();
        Task<DocumentChecklistModel> GetEntityAsync(long id);  
        Task<long> SaveEntityAsync(DocumentChecklistModel checklistModel);
        Task<bool> DeleteEntityAsync(long id);
        Task<bool> DeleteEntitiesAsync(List<long> ids);
    }
}
