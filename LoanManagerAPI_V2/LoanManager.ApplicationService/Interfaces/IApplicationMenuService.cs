using LoanManager.ApplicationService.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
    public interface IApplicationMenuService
    {
        Task<List<ApplicationMenuModel>> GetApplicationMenuAsync();
        Task<ApplicationHeaderModel> GetApplicationHeaderAsync();
    }
}
