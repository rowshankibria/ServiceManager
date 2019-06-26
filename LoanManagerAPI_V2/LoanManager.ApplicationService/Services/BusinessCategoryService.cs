using AutoMapper;
using LoanManager.Data;
using LoanManager.Data.Models;
using LoanManager.Shared;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
   
    public class BusinessCategoryService: BaseService, IBusinessCategoryService
    {
        private readonly IRepository<BusinessCategory> businessCategoryRepository;
        private readonly IRepository<BusinessCategoryType> businessCategoryTypeRepository;
        private readonly IApplicationCacheService applicationCacheService;

        public BusinessCategoryService(ILogger<BusinessCategoryService> logger
            , IMapper mapper
            , ILoggedInUserService loggedInUserService
            , IApplicationCacheService applicationCacheService,
            IRepository<BusinessCategory> businessCategoryRepository, 
            IRepository<BusinessCategoryType> businessCategoryTypeRepository) : base(logger, mapper, loggedInUserService)
        {
            this.businessCategoryRepository = businessCategoryRepository;
            this.businessCategoryTypeRepository = businessCategoryTypeRepository;
            this.applicationCacheService = applicationCacheService;
        }

        public List<SelectModel> GetBusinessCategoryByType(long typeId)
        {
            var types = this.applicationCacheService.GetBusinessCategoryType();
            return types.Where(x => x.Id == typeId).First().BusinessCategories.Where(c => !c.IsInternal).Select(x => new SelectModel
            {
                Id = x.Id,
                Name = x.Name,
                IsDefault = x.IsDefault
            }).ToList();
        }

        public Task<List<SelectModel>> GetBusinessCategoryByTypeAsync(long typeId)
        {
            var types = this.applicationCacheService.GetBusinessCategoryType();
            return Task.Run(() => types.Where(x => x.Id == typeId).First().BusinessCategories.Where(c => !c.IsInternal).Select(x => new SelectModel
            {
                Id = x.Id,
                Name = x.Name,
                IsDefault = x.IsDefault
            }).ToList());
        }
    }
}
