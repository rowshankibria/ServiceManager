using System;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using LoanManager.ApplicationService.Models;
using LoanManager.Shared;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
    public interface IBusinessProfileService
    {
        Task<LoadResult> GetBusinessProfileListAsync(DataSourceLoadOptionsBase options);
        Task<BusinessProfileModel> GetBusinessProfileAsync(long id);
        Task<List<SelectModel>> GetBusinessProfileSelectItemsAsync();
        List<TabModel> GetBusinessProfileDetailsTabs(long id);
        Task<bool> DeleteBusinessProfileByIdAsync(long id);
        Task<bool> DeleteBusinessProfilesAsync(List<long> ids);
        Task<long> SaveBusinessProfileAsync( BusinessProfileModel businessProfileModel);
    }
}
