using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class EmailHistoryModel
    {
        public long Id { get; set; }
        public long EntityTypeId { get; set; }
        public long EntityId { get; set; }
        public string EmailSender { get; set; }
        public string EmailReceiver { get; set; }
        public string Subject { get; set; }
        public string EmailContent { get; set; }
        public string CreatedBy { get; set; }
        public long CreatedByContactId { get; set; }
    }
}
