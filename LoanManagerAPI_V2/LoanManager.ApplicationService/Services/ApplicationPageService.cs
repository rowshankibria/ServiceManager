using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using LoanManager.ApplicationService.Models;
using LoanManager.Data;
using LoanManager.Data.Models;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using LoanManager.Shared;

namespace LoanManager.ApplicationService
{
    public class ApplicationPageService : BaseService, IApplicationPageService
    {
        private readonly IRepository<ApplicationPage> applicationPageRepository;
        public ApplicationPageService(ILogger<ApplicationPageService> logger, IMapper mapper, IRepository<ApplicationPage> applicationPageRepository, ILoggedInUserService loggedInUserService) : base(logger, mapper, loggedInUserService)
        {
            this.applicationPageRepository = applicationPageRepository;
        }


        public async Task<ApplicationListPageModel> GetApplicationListPageByNameAsync(string name)
        {
            var page = await applicationPageRepository.Where(t => t.Name == name)
                                .Include(p => p.ApplicationPageFieldDetails)
                                .Include(p => p.ApplicationPageServices)
                                .Include(p => p.ApplicationPageNavigations)
                                .FirstOrDefaultAsync();

            if (page == null)
            {
                throw new ItmNotFoundException("Application page not found");
            }

            return BuildPageModel(page);
        }

        public async Task<ApplicationListPageModel> GetApplicationListPageByRoutingUrlAsync(string routingUrl)
        {
            var page = await applicationPageRepository.Where(t => t.RoutingUrl == routingUrl)
                                .Include(p => p.ApplicationPageFieldDetails)
                                .Include(p => p.ApplicationPageServices)
                                .Include(p => p.ApplicationPageNavigations)
                                .FirstOrDefaultAsync();

            if (page == null)
            {
                throw new ItmNotFoundException("Application page not found");
            }

            return BuildPageModel(page);
        }

        private ApplicationListPageModel BuildPageModel(ApplicationPage page)
        {
            var pagemodel = new ApplicationListPageModel();
            pagemodel.Id = page.Id;
            pagemodel.Name = page.Name;
            pagemodel.Title = page.Title;
            pagemodel.RoutingUrl = page.RoutingUrl;
            pagemodel.PageType = page.PageType;

            pagemodel.Fields = page.ApplicationPageFieldDetails.OrderBy(f => f.RowNo)
                               .Select(f => new
                               {
                                   dataField = f.Name,
                                   cellTemplate = f.CellTemplate,
                                   caption = f.Caption,
                                   visible = f.Visible,
                                   //placeholder = "Search...",
                                   dataType = f.DataType,
                                   format= f.Format,
                                   allowFiltering = f.RowFilterEnabled,
                                   alignment = f.Alignment,
                                   sortOrder = f.DefaultSortOrder
                               });

            pagemodel.PageServiceUrls = page.ApplicationPageServices
                                        .Select(f => new
                                        {
                                            f.ServiceName,
                                            f.ServiceType,
                                            f.ServiceUrl
                                        });

            pagemodel.PageNavigationUrls = page.ApplicationPageNavigations
                                           .Select(s => new
                                           {
                                               s.LinkName,
                                               s.NavigateUrl
                                           });

            return pagemodel;
        }
         
        public Task<ApplicationDetailPageModel> GetApplicationDetailPageAsync(string name)
        {
            throw new System.NotImplementedException();
        }

       
    }
}
