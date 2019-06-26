using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using LoanManager.Web.API.Controllers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace LoanManager.Web.Api.Controllers
{
    [Route("api/token")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private IConfiguration _Configuration { get; }

        public AuthenticationController(IConfiguration configuration)
        {
            _Configuration = configuration;
        }

        [Route("get-token")]
        [AllowAnonymous]
        [HttpPost]
        public IActionResult Post([FromBody]LoginViewModel loginViewModel)
        {
            string Issuer = _Configuration.GetSection("AuthCredentials").GetSection("Issuer").Value;
            string Audience = _Configuration.GetSection("AuthCredentials").GetSection("Audience").Value;
            string SigningKey = _Configuration.GetSection("AuthCredentials").GetSection("SigningKey").Value;

            if (ModelState.IsValid)
            {
                //call identity service
                //This method returns user id from username and password.
                var userId = 1;//for tests
                if (userId == -1)
                {
                    return Unauthorized();
                }

                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.UniqueName, loginViewModel.email),
                    new Claim(JwtRegisteredClaimNames.Jti, userId.ToString())
                };

                var token = new JwtSecurityToken
                (
                    issuer: Issuer,
                    audience: Audience,
                    claims: claims,
                    expires: DateTime.UtcNow.AddDays(60),
                    notBefore: DateTime.UtcNow,
                    signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SigningKey)),
                            SecurityAlgorithms.HmacSha256)

                );

                return Ok(new
                {
                    accessToken = new JwtSecurityTokenHandler().WriteToken(token),
                    refreshToken = new JwtSecurityTokenHandler().WriteToken(token),
                    roles = new string[] { "ADMIN" }
                });
            }

            return BadRequest();
        }       
    }    
}