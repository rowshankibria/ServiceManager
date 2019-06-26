using LoanManager.Data;
using LoanManager.Data.Models;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace LoanManager.ApplicationService
{
    public class ApplicationCacheService : IApplicationCacheService
    {
        private readonly IRepository<SystemRoleRight> applicationRoleRightRepository;
        private readonly IRepository<ApplicationMenu> applicationMenuRepository;
        private readonly IRepository<BusinessCategoryType> businessCategoryTypeRepository;
        private readonly IMemoryCache memoryCache;
        private const string ApplicationMenuKey = "ApplicationMenuKey";
        private const string ApplicationRoleRightKey = "ApplicationRoleRightKey";

        private int defaultCacheTimeout = 1;

        public ApplicationCacheService(IRepository<SystemRoleRight> applicationRoleRightRepository, IRepository<ApplicationMenu> applicationMenuRepository, IRepository<BusinessCategoryType> businessCategoryTypeRepository, IMemoryCache memoryCache)
        {
            this.applicationMenuRepository = applicationMenuRepository;            
            this.businessCategoryTypeRepository = businessCategoryTypeRepository;
            this.memoryCache = memoryCache;
            this.applicationRoleRightRepository = applicationRoleRightRepository;
        }

        public List<ApplicationMenu> GetApplicationMenu()
        {
            if (!memoryCache.TryGetValue("ApplicationMenuKey", out List<ApplicationMenu> appMenu))
            {                
                appMenu = this.applicationMenuRepository.WhereAsync(m=>m.IsVisible.Value).Result.ToList();
                memoryCache.Set("ApplicationMenuKey", appMenu, GetCacheOption(defaultCacheTimeout));
            }
            return appMenu;
        }


        public void ClearApplicationMenu()
        {
            memoryCache.Remove("ApplicationMenuKey");
        }

      

        public List<BusinessCategoryType> GetBusinessCategoryType()
        {
            if (!memoryCache.TryGetValue("BusinessCategoryTypetKey", out List<BusinessCategoryType> businessCategoryType))
            {

                businessCategoryType = this.businessCategoryTypeRepository.GetAll().Include(x=>x.BusinessCategories).ToList();
                memoryCache.Set("BusinessCategoryTypetKey", businessCategoryType, GetCacheOption(defaultCacheTimeout));
            }
            return businessCategoryType;
        }

        public void ClearBusinessCategoryType()
        {
            memoryCache.Remove("BusinessCategoryTypetKey");
        }

        public List<SystemRoleRight> GetApplicationRoleRight()
        {
            if (!memoryCache.TryGetValue("ApplicationRoleRightKey", out List<SystemRoleRight> roleRight))
            {

                roleRight = this.applicationRoleRightRepository.GetAllAsync().Result.ToList();
                memoryCache.Set("ApplicationRoleRightKey", roleRight, GetCacheOption(defaultCacheTimeout));
            }
            return roleRight;
        }

        public void ClearApplicationRoleRight()
        {
            memoryCache.Remove("ApplicationRoleRightKey");
        }

        private MemoryCacheEntryOptions GetCacheOption(int timeoutMinute)
        {
            MemoryCacheEntryOptions options = new MemoryCacheEntryOptions
            {
                //AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(300), // cache will expire in 25 seconds
                SlidingExpiration = TimeSpan.FromSeconds(timeoutMinute * 60) // caceh will expire if inactive for 5 seconds
            };
            return options;
        }

        public void RemoveItemByKey(string key)
        {
            memoryCache.Remove(key);
        }

        public void SetItemByKey(string key, object value, int timeoutMinute=0)
        {
            if (timeoutMinute == 0)
            {
                timeoutMinute = defaultCacheTimeout;
            }

            memoryCache.Set(key, value, GetCacheOption(timeoutMinute));
        }

        public object GetItemByKey(string key)
        {
            object retValue;
            memoryCache.TryGetValue(key, out retValue);
            return retValue;
        }
    }
}
