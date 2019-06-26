using LoanManager.ApplicationService.Models;
using LoanManager.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Api.Models
{
    public class NoteViewModel
    {       
        /// <summary>
        /// 
        /// </summary>
        public List<NoteModel> NoteList { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public LoanApplicationModel LoanApplicationModel { get; set; }
    }
}
