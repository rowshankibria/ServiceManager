using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using LoanManager.ApplicationService.Models;
using LoanManager.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
    public interface IRoleService
    {
        Task<LoadResult> GetRolesAsync(DataSourceLoadOptionsBase options);
        Task<bool> IsRightExistAsync(long rightId);
        Task<bool> DeleteRoleAsync(long id);
        Task<bool> DeleteRolesAsync(List<long> ids);
        Task<RoleModel> GetRoleAsync(long id);
        List<SelectModel> RoleSelectItems();
        Task<long> UpdateRoleAsync(long id, RoleModel model);
        Task<long> CreateRoleAsync(RoleModel model);
        Task<LoadResult> GetUserByRoleAsync(long roleId, DataSourceLoadOptionsBase options);
        Task<List<TreeModel>> GetUserPermissionsAsync(long parentRoleId);
        Task<List<TreeModel>> GetActiveRolesAsync();
        Task<List<TreeModel>> GetPermissionsByRoleListAsync(List<long> roleIds);
        List<long> GetUserSelectedRolesByUserAsync();
        Task<List<TreeModel>> GetRightByRoleListAsync(long id);
    }
}