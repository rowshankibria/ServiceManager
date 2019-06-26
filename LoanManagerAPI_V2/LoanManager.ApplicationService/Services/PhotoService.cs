using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using LoanManager.ApplicationService.Models;
using LoanManager.Data;
using LoanManager.Data.Models;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using LoanManager.Shared;

namespace LoanManager.ApplicationService
{
    public class PhotoService : BaseService, IPhotoService
    {
        private readonly IRepository<Photo> photoRepository;
        private readonly IHostingEnvironment hostingEnvironment;
        private readonly IMapper mapper;

        public PhotoService(ILogger<PhotoService> logger, IMapper mapper, IRepository<Photo> photoRepository, IHostingEnvironment hostingEnvironment, ILoggedInUserService loggedInUserService) : base(logger, mapper, loggedInUserService)
        {
            this.photoRepository = photoRepository;
            this.hostingEnvironment = hostingEnvironment;
            this.mapper = mapper;
        }
        
        /// <summary>
        /// Get image file by file name
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public byte[] GetImageFile(string fileName)
        {
            byte[] imageBytes = null;
            string folderName = "images";
            string webRootPath = hostingEnvironment.WebRootPath;
            string newPath = Path.Combine(webRootPath, folderName);

            //System.IO.File.ReadAllBytes(path)

            if (Directory.Exists(newPath))
            {
                string fullPath = Path.Combine(newPath, fileName);
                imageBytes = System.IO.File.ReadAllBytes(fullPath);

                //using (Image image = Image.FromFile(fullPath))
                //{
                //    //using (MemoryStream m = new MemoryStream())
                //    //{
                //    //    image.Save(m, image.RawFormat);
                //    //    imageBytes = m.ToArray();
                //    //    //base64String = Convert.ToBase64String(imageBytes);
                //    //}
                //}
            }

            return imageBytes;
        }

        /// <summary>
        /// Get image file by file name
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public byte[] GetDocumentByte(string fileName)
        {
            byte[] file = null;
            string folderName = "tempfilestore";

            string webRootPath = hostingEnvironment.WebRootPath;
            string newPath = Path.Combine(webRootPath, folderName);

            if (Directory.Exists(newPath))
            {
                string fullPath = Path.Combine(newPath, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read))
                {
                    using (var reader = new BinaryReader(stream))
                    {
                        file = reader.ReadBytes((int)stream.Length);
                    }
                }
            }

            return file;
        }
    }
}
