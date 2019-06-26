using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class ApplicationHeaderModel
    {
        public string DisplayName { get; set; }
        public string ImageSource { get; set; }
        public string Gender { get; set; }

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

        [JsonIgnore]
        public byte[] PhotoThumb { get; set; }

    }
}
