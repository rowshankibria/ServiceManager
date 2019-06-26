using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Web.Api
{
    public static class Configurations
    {
        //public static IConfiguration Configuration { get; }

        public static IConfiguration Configuration { get; } = new ConfigurationBuilder()
         .SetBasePath(Directory.GetCurrentDirectory())
         .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
         .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", optional: true)
         .AddEnvironmentVariables()
         .Build();

        public static string ApplicationUrl
        {
            get
            {
                return Configuration["ApplicationUrl"];
            }
        }

        public static string[] ApplicationAllowedUrls
        {
            get
            {
                return Configuration.GetSection("ApplicationAllowedUrls").Get<string[]>();
            }
        }

        public static string ApplicationConnectionString
        {
            get
            {
                return Configuration.GetConnectionString("ApplicationConnection");
            }
        }      

        public static string HangfireConnectionString
        {
            get
            {
                return Configuration.GetConnectionString("HangfireConnection");
            }
        }

        public static string TokenAuthority
        {
            get
            {
                return Configuration["TokenAuthority"];
            }
        }

        public static string TokenAudience
        {
            get
            {
                return Configuration["TokenAudience"];
            }
        }

        public static string AuthenticationCredentialIssuer
        {
            get
            {
                return Configuration.GetSection("AuthCredentials").GetSection("Issuer").Value;
            }
        }

        public static string AuthenticationCredentialAudience
        {
            get
            {
                return Configuration.GetSection("AuthCredentials").GetSection("Audience").Value;
            }
        }

        public static string AuthenticationCredentialSignKey
        {
            get
            {
                return Configuration.GetSection("AuthCredentials").GetSection("SigningKey").Value;
            }
        }


    }
}
