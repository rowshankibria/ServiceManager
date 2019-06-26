using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using LoanManager.Api.Models;
using LoanManager.ApplicationService;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace LoanManager.Web.API.Controllers
{
    [Route("token")]
    public class IdentityController : Controller
    {
        private IConfiguration _Configuration { get; }

        private readonly IUserService userService;

        public IdentityController(IConfiguration configuration, IUserService userService)
        {
            _Configuration = configuration;
            this.userService = userService;
        }

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
                //var userId = 1;//for tests
                UserViewModel result = new UserViewModel();
                result.User = userService.GetUserByEmailAsync(loginViewModel.email, loginViewModel.password).GetAwaiter().GetResult();

                if(result.User == null)
                {
                    result.User = userService.GetUserByUserIdAsync(loginViewModel.email, loginViewModel.password).GetAwaiter().GetResult();
                }

                if (result.User == null)
                {
                    return Unauthorized();
                }

                //if (userId == -1)
                //{
                //    return Unauthorized();
                //}

                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.UniqueName, loginViewModel.email),
                    new Claim(JwtRegisteredClaimNames.Jti, result.User.Id.ToString())
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
                    roles = new string[] { "ADMIN" },
                    SystemUser = result.User
                });
            }

            return BadRequest();
        }
    }

    //public class LoginViewModel
    //{
    //    public long UserId { get; set; }
    //    public long ContactId { get; set; }
    //    public string Gender { get; set; }
    //    public string UserName { get; set; }
    //    public string Password { get; set; }
    //    public string Login { get; set; }
    //}

    public class LoginViewModel
    {
        public string username { get; set; }
        public string email { get; set; }
        public string password { get; set; }
    }

    public class Credential
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}