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
    public interface IUserService
    {
        Task<LoadResult> GetActiveUsersAsync(DataSourceLoadOptionsBase options);
        Task<IQueryable> GetActiveUsersAsync();
        List<SelectModel> GetUserTypeSelectItems();
        Task<UserModel> GetUserByIdAsync(long id);
        Task<UserModel> GetUserByEmailAsync(string email, string password);
        Task<UserModel> GetUserByUserIdAsync(string userId, string password);
        Task<long> InsertUserDetailValuesAsync(UserModel userModel);
        Task<long> UpdateUserDetailValuesAsync(long id, UserModel userModel);
        Task<bool> DeleteUsersAsync(List<long> ids);
        Task<bool> DeleteUserByIdAsync(long id);
        bool ValidateUserEmail(long id, string email);
        bool ValidateUserName(long id, string username);
        Task<long> RegisterUserAsync(UserModel userModel);
    }
}
