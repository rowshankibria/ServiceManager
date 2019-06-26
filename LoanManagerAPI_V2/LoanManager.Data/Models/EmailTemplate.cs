using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class EmailTemplate
    {
        public long Id { get; set; }
        public int TemplateType { get; set; }        
        public string TemplateSubject { get; set; }
        public string TemplateDetail { get; set; }
    }
}
