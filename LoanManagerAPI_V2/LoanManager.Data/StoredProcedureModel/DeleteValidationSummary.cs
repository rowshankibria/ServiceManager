using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Data.StoredProcedureModel
{
    public class DeleteValidationSummary
    {
        public bool IsValid { get; set; }
        public string ValidationMessage { get; set; }
    }
}
