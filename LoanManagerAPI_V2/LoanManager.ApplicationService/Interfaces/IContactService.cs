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
    public interface IContactService
    {
        Task<IQueryable> GetContacts();
        Task<ContactModel> GetEntityAsync(long id);
        Task<ContactModel> GetEntityForUserAddAsync(long id);
        List<TabModel> GetEntityDetailsTabs(long id);
        Task<long> SaveEntityAsync(ContactModel contactModel);
        Task<bool> DeleteEntityAsync(long id);
        Task<bool> DeleteEntitiesAsync(List<long> ids);
        bool ValidateUserEmail(long id, string email);
        List<SelectModel> GetPreferredPhoneTypeSelectedItem();
        List<SelectModel> ContactSelectItems();
        List<SelectModel> GetGenderTypeSelectedItem();
        Task<LoadResult> GetDevexContacts(DataSourceLoadOptionsBase options);
        List<SelectModel> GetEmployeeSelectItemsAsync();
        List<SelectModel> GetContactSelectItemsAsync();
    }
}
