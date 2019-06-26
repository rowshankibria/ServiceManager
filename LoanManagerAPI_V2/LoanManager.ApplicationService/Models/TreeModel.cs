using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class TreeModel
    {
        public long Id { get; set; }
        public long SId { get; set; }
        public long ParentId { get; set; }
        public long SParentId { get; set; }
        public string Name { get; set; }
        public bool IsSelected { get; set; }

        public List<TreeModel> Items { get; set; }
    }
}
