using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class AttachedFileModel
    {
        public long Id { get; set; }
        public long ApplicationId { get; set; }        
        public string Title { get; set; }
        public string Description { get; set; }
        public string FileName { get; set; }
        public string OrginalFileName { get; set; }        
        public string FileSize { get; set; }
        public string FileExtension { get; set; }
        public string MimeType { get; set; }
        public string FormatDate { get; set; }
        public long DocumentCategoryId { get; set; }
        public string DocumentCategoryName { get; set; }
    }
}
