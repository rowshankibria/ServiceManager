using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class ApplicationMenuModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Caption { get; set; }
        public int RowNo { get; set; }
        public string HelpText { get; set; }
        public int? ParentId { get; set; }
        public int? PageId { get; set; }
        public string ImageSource { get; set; }
        public string NavigateUrl { get; set; }
        public int? EntityId { get; set; }
        public int? EntityRightId { get; set; }

        //public ApplicationMenuModel Parent { get; set; }
        public ICollection<ApplicationMenuModel> InverseParent { get; set; }
    }
}
