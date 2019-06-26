using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class DownloadFileModel
    {
        public string FileName { get; set; }
        public string MimeType { get; set; }
        public byte[] File { get; set; }
    }
}
