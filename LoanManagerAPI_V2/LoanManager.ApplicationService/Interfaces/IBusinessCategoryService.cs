using LoanManager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
    public interface IBusinessCategoryService
    {
        List<SelectModel> GetBusinessCategoryByType(long typeId);
        Task<List<SelectModel>> GetBusinessCategoryByTypeAsync(long typeId);
    }
}
