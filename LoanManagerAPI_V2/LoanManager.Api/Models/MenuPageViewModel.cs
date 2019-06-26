using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Api.Models
{
    class MenuPageViewModel
    {
        internal MenuPageViewModel()
        {
            MenuItems = new List<MenuItemModel>();
        }
        public List<MenuItemModel> MenuItems;
    }
}
