using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Itm.Web.UI.Models;
using Itm.Web.UI.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Itm.Web.UI.Controllers
{
    [Route("resource")]
    public class ResourceController : Controller
    {

        private readonly ClientAppSettings _clientAppSettings;

        public ResourceController(IOptions<ClientAppSettings> clientAppSettings)
        {
            _clientAppSettings = clientAppSettings.Value;
        }

        [HttpGet("{key}")]
        [AllowAnonymous]
        public async Task<IActionResult> Index(string key)
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(_clientAppSettings.apiServer);

            HttpResponseMessage response = await client.GetAsync("api/dms/document/download/" + key);

            if(!response.IsSuccessStatusCode )
            {
                return View("~/Pages/Error.cshtml");
            }

            string value = await response.Content.ReadAsStringAsync();

            DownloadFileModel downloadFileModel = Newtonsoft.Json.JsonConvert.DeserializeObject<DownloadFileModel>(value);

            return File(downloadFileModel.File, downloadFileModel.MimeType, downloadFileModel.FileName);

        }
    }

   public class DownloadFileModel
    {
        public string FileName { get; set; }
        public string MimeType { get; set; }
        public byte[] File { get; set; }
    }
}