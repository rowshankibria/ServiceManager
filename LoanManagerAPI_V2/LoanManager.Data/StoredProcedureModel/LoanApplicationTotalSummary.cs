using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Data.StoredProcedureModel
{
    public class LoanApplicationTotalSummary
    {
        //public int Id { get; set; }
        public int NotStartedValue { get; set; }
        public int InProgressValue { get; set; }
        public int AcceptedValue { get; set; }
        public int RejectedValue { get; set; }
        
    }
}
