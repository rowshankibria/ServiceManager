
using LoanManager.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Linq;
using LoanManager.Shared;
using LoanManager.Api.Providers;
using LoanManager.ApplicationService;
using LoanManager.ApplicationService.Models;
using LoanManager.Configuration;
using System;
using Microsoft.AspNetCore.Http;

namespace LoanManager.Api.Controllers
{
     
    [Route("api/shared/file-upload")]
    public class FileUploadController : BaseController
    { 
        private readonly IHostingEnvironment _hostingEnvironment;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="loggedInUserService"></param>
        /// <param name="hostingEnvironment"></param>
        public FileUploadController(ILogger<FileUploadController> logger, ILoggedInUserService loggedInUserService, IHostingEnvironment hostingEnvironment) : base(logger, loggedInUserService)
        {    
            this._hostingEnvironment = hostingEnvironment;
        }

        /// <summary>
        /// get configuration menu
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("upload-photo")]
        [AllowAnonymous]
        public IActionResult UploadPhoto()
        {
            ResponseMessage<string> response = new ResponseMessage<string>();

            try
            {
                var file = Request.Form.Files[0];
                string folderName = "images";
                string fileName="";
                string webRootPath = _hostingEnvironment.WebRootPath;
                string newPath = Path.Combine(webRootPath, folderName);
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                if (file.Length > 0)
                {
                    fileName = Guid.NewGuid().ToString().Substring(0, 8) + "_" + ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string fullPath = Path.Combine(newPath, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                response.Result = fileName;
                response.Message = "Upload Successful.";
                return Ok(response);
            }
            catch (System.Exception ex)
            {                
                response.Message = "Image cannot be uploaded.";
                return Ok(response);
            }
        }

        /// <summary>
        /// Upload File
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("upload-file")]
        //TODO: [ActionAuthorize(ApplicationPermission.Document.UploadDocument)]
        [AllowAnonymous]
        public IActionResult UploadFile()
        {
            ResponseMessage<string> response = new ResponseMessage<string>();

            try
            {
                IFormFile file = Request.Form.Files[0];
                string folderName = "tempfilestore";
                string fileName = "";
                string webRootPath = _hostingEnvironment.WebRootPath;
                string newPath = Path.Combine(webRootPath, folderName);
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                if (file.Length > 0)
                {
                    fileName = Guid.NewGuid().ToString().Substring(0, 8) + "_" + ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string fullPath = Path.Combine(newPath, fileName);
                    using (FileStream stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                response.Result = fileName;
                response.Message = "Upload Successful.";
                return Ok(response);
            }
            catch (Exception)
            {
                response.Message = "File cannot be uploaded.";
                return Ok(response);
            }
        }
    }
}