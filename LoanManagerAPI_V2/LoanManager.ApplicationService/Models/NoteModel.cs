using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class NoteModel
    {       
        public long Id { get; set; }
        public long EntityTypeId { get; set; }
        public long EntityId { get; set; }
        public string NoteDetail { get; set; }
        public string ResponseDetail { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedFor { get; set; }
        public bool IsPrivate { get; set; }
        public long? NoteTypeId { get; set; }
        public long CreatedByContactId { get; set; }

        public string AssignedByPhotoUrl { get; set; }
        public string AssignedToPhotoUrl { get; set; }
        public bool IsAssignedToMe { get; set; } = false;
    }
}
