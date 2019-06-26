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
    public interface ICompanyService
    {
        List<SelectModel> CompanySelectItems();
        Task<LoadResult> GetCompaniesAsync(DataSourceLoadOptionsBase options);
        Task<LoadResult> GetCompaniesByBusinessProfileIdAsync(long id, DataSourceLoadOptionsBase options);
        Task<CompanyModel> GetCompanyAsync(long id);
        Task<List<SelectModel>> GetCompanySelectItemsAsync();
        Task<List<SelectModel>> GetCompanySelectItemsByBusinessProfileIdAsync(List<long> businessProfileIds);
        Task<List<SelectModel>> GetCompanySelectItemsByBusinessProfileIdAsync(long businessProfileId);

        Task<long> ModifyCompanyAsync(long id, CompanyModel model);
        Task<long> DeleteCompanyAsync(long id);
        Task<bool> DeleteCompaniesAsync(List<long> ids);
        List<TabModel> GetEntityDetailsTabs(long id);
    }
}
