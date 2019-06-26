using AutoMapper;
using LoanManager.Shared;
using Microsoft.Extensions.Logging;

namespace LoanManager.ApplicationService
{
    public abstract class BaseService : ILoggedInUserService
    {
        private readonly ILoggedInUserService loggedInUserService;

        protected BaseService(ILogger logger, IMapper mapper, ILoggedInUserService loggedInUserService)
        {
            Logger = logger;
            Mapper = mapper;
            this.loggedInUserService = loggedInUserService;
        }



        public ILoggedInUser LoggedInUser => loggedInUserService.LoggedInUser;

        protected IMapper Mapper { get; }

        protected ILogger Logger { get; }
     
    }
}
