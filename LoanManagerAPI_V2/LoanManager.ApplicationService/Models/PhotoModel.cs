using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class PhotoModel
    {
        public PhotoModel()
        {
            IsUpdated = false;
            IsDeleted = false;
        }

        public int Id { get; set; }
        [JsonIgnore]
        public byte[] PhotoThumb { get; set; }
        public bool IsDefault { get; set; }
        public bool IsVisibleInPublicPortal { get; set; }
        public int DisplayOrder { get; set; }
        public string FileName { get; set; }
        public string OrginalFileName { get; set; }
        public string Description { get; set; }


        public string PhotoThumbnail
        {
            get
            {
                if (this.PhotoThumb != null)
                    return Convert.ToBase64String(this.PhotoThumb);

                return null;
            }
            set
            {
                if (value != null)
                    this.PhotoThumb = Encoding.ASCII.GetBytes(value);
            }
        }
        public string UploadedFileName { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsUpdated { get; set; }


    }
}
