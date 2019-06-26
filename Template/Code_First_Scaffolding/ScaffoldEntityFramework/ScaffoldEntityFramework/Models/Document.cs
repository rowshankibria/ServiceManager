using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class Document
    {
        public Document()
        {
            ApplicationDocuments = new HashSet<ApplicationDocument>();
        }

        public long Id { get; set; }
        public long ApplicationId { get; set; }
        public long DocumentCategoryId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string FileName { get; set; }
        public string OrginalFileName { get; set; }
        public byte[] OrginalFile { get; set; }
        public DateTime? DateAdded { get; set; }
        public string FileSize { get; set; }
        public string FileExtension { get; set; }
        public string MimeType { get; set; }
        public byte[] TimeStamp { get; set; }

        public LoanApplication Application { get; set; }
        public CustomCategory DocumentCategory { get; set; }
        public ICollection<ApplicationDocument> ApplicationDocuments { get; set; }
    }
}
