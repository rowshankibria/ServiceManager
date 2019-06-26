using LoanManager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
    public interface ISharedService
    {
        Task<List<SelectModel>> GetCompanySelectItemsAsync();
        Task<List<SelectModel>> GetTimeZoneSelectItemsAsync();
        Task<List<SelectModel>> GetCountrySelectItemsAsync();
        Task<List<SelectModel>> GetStateSelectItemsAsync(long countryId);
        Task<List<SelectModel>> GetLoanTypeSelectItemsAsync();
        Task<List<SelectModel>> GetBranchSelectItemsAsync();
    }
}
