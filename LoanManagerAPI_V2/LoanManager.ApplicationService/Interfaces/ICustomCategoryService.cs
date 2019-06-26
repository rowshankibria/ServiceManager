using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using LoanManager.ApplicationService.Models;
using LoanManager.Data.Models;
using LoanManager.Shared;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
    public interface ICustomCategoryService
    {
        Task<LoadResult> GetCustomCategoryListByRoutingKeyAsync(string routingKey, DataSourceLoadOptionsBase options);

        Task<List<CustomCategoryModuleModel>> GetCustomCategoryModuleListAsync();
        Task<List<SelectModel>> GetCustomCategoryListByTypeIdAsync(int categoryTypeId);
        Task<List<SelectModel>> GetCustomCategoryListByTypeIdAsync(int categoryTypeId, int businessProfileId);
        Task<List<CustomCategoryTypeModel>> GetCustomCategoryTypeListAsync(List<long> ids);
        Task<List<SelectModel>> GetEntityTypeListAsync();

        Task<List<SelectModel>> GetMapTypeSelectListAsync(string routingKey);

        Task<CustomCategoryModel> GetCustomCategoryByIdAsync(long id);
        Task<CustomCategoryTypeModel> GetCustomCategoryTypeByRoutingKeyAsync(string routingKey);
        Task<long> SaveCustomCategoryAsync(long id, CustomCategoryModel model);
        Task<long> DeleteEntityAsync(long id);
        Task<bool> DeleteEntitiesAsync(List<long> ids);
        Task<bool> MoveUpCategoriesAsync(long id);
        Task<bool> MoveDownCategoriesAsync(long id);


    }
}
