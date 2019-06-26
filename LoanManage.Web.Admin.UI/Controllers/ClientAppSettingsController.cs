using Itm.Web.UI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Itm.Web.UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientAppSettingsController : ControllerBase
    {
        private readonly ClientAppSettings _clientAppSettings;

        public ClientAppSettingsController(IOptions<ClientAppSettings> clientAppSettings)
        {
            _clientAppSettings = clientAppSettings.Value;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_clientAppSettings);
        }
    }
}