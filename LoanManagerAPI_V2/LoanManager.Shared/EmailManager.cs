using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Shared
{
    public class EmailManager
    {
        public static IConfiguration EmilConfiguration { get; } = new Microsoft.Extensions.Configuration.ConfigurationBuilder()
         .SetBasePath(Directory.GetCurrentDirectory())
         .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
         .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", optional: true)
         .AddEnvironmentVariables()
         .Build();

        public string SMTPServer
        {
            get { return EmilConfiguration["SMTPServer"]; }
        }

        public int SMTPPort
        {
            get { return Convert.ToInt32(EmilConfiguration["SMTPPort"]); }
        }

        public bool RequireSSL
        {
            get { return Convert.ToBoolean(EmilConfiguration["RequireSSL"]); }
        }

        public string SenderEmailAddress
        {
            get { return EmilConfiguration["SenderEmailAddress"]; }
        }

        public string SenderPassword
        {
            get { return EmilConfiguration["SenderPassword"]; }
        }

        public string SenderName
        {
            get { return EmilConfiguration["SenderName"]; }
        }

        public bool HasSMTPCredentialsProvided { get; set; }

        /// <summary>
        /// Default Constructor
        /// If any parameter is not found SMTP settings will be configured from configuration settings
        /// </summary>
        public EmailManager()
        {
            if (!string.IsNullOrEmpty(this.SMTPServer) && this.SMTPPort > 0 && !string.IsNullOrEmpty(this.SenderEmailAddress) && !string.IsNullOrEmpty(this.SenderPassword))
                this.HasSMTPCredentialsProvided = true;
            else
                this.HasSMTPCredentialsProvided = false;
        }

        /// <summary>
        /// Sends the specifide MailMessage via SMTP Client
        /// </summary>
        /// <param name="message">Mail Message</param>
        /// <returns>Delivery Status</returns>
        public bool SendEmail(MailMessage message)
        {
            bool result = false;

            if (this.HasSMTPCredentialsProvided)
            {
                SmtpClient smtpClient = new SmtpClient(this.SMTPServer, this.SMTPPort);
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential(this.SenderEmailAddress, this.SenderPassword);
                smtpClient.EnableSsl = this.RequireSSL;
                smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtpClient.Timeout = 50000;

                try
                {
                    MailAddress senderAddress = new MailAddress(this.SenderEmailAddress, this.SenderName);
                    message.From = senderAddress;

                    smtpClient.Send(message);
                    result = true;
                }
                catch (SmtpException)
                {
                    //TODO!!! Log Email Exception
                    //throw;
                }
                finally
                {
                    smtpClient = null;
                    message = null;
                }
            }

            return result;
        }

        public string PrepreTag(string fieldName)
        {
            return "<tag>" + fieldName + "</tag>";
        }
    }
}
