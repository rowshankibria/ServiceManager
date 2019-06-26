using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Shared
{
    public class SelectModel
    {
        public object Id { get; set; }        
        public object Name { get; set; }
        public int? BusinessProfileId { get; set; }        
        public bool IsDefault { get; set; }
        public bool IsActive { get; set; }
        public object Tag { get; set; }
    }
}
