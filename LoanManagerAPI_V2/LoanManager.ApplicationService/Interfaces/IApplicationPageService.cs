using LoanManager.ApplicationService.Models;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
    public interface IApplicationPageService
    {
        Task<ApplicationListPageModel> GetApplicationListPageByNameAsync(string name);
        Task<ApplicationListPageModel> GetApplicationListPageByRoutingUrlAsync(string routingUrl);
        Task<ApplicationDetailPageModel> GetApplicationDetailPageAsync(string name);
    }
}
