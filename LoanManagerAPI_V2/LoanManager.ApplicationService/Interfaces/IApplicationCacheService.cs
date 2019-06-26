using LoanManager.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
    public interface IApplicationCacheService
    {
        List<ApplicationMenu> GetApplicationMenu();
        void ClearApplicationMenu();       
        List<BusinessCategoryType> GetBusinessCategoryType();
        void ClearBusinessCategoryType();
        List<SystemRoleRight> GetApplicationRoleRight();
        void ClearApplicationRoleRight();
        void RemoveItemByKey(string key);
        void SetItemByKey(string key, object value, int timeoutMinute = 0);
        object GetItemByKey(string key);
    }
}
