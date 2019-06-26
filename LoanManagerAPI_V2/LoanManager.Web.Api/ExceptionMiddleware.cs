using LoanManager.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Data.SqlClient;
using System.Net;
using System.Threading.Tasks;

namespace LoanManager.Web.Api
{
    /// <summary>
    /// 
    /// </summary>
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate next;
        private readonly ILogger logger;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="next"></param>
        /// <param name="logger"></param>
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            this.next = next;
            this.logger = logger;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="context"></param>
        /// <param name="exception"></param>
        /// <returns></returns>
        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            string message = "Internal server error, please contact with administrator";

            ResponseMessage<string> response = new ResponseMessage<string>();


            if (exception is ItmException)
            {
                context.Response.StatusCode = exception.HResult;
                message = exception.Message;
            }
            else if (exception is DbUpdateException)
            {
                if ((exception.InnerException as System.Data.SqlClient.SqlException).Number == 547)
                {
                    //&& ((SqlException)exception).ErrorCode == 547
                    //context.Response.StatusCode = exception.HResult;
                    message = "The record cannot be deleted because it is associated with another record.";
                }
            }
            else if (exception is AggregateException)
            {
                if (((exception.InnerException as DbUpdateException).InnerException as SqlException).Number == 547)
                {
                    //&& ((SqlException)exception).ErrorCode == 547
                    //context.Response.StatusCode = exception.HResult;
                    message = "The record cannot be deleted because it is associated with another record.";
                }
            }
            else if (exception is SqlException)
            {
                if ((exception as SqlException).ErrorCode == 547)
                {
                    //&& ((SqlException)exception).ErrorCode == 547
                    //context.Response.StatusCode = exception.HResult;
                    message = "The record cannot be deleted because it is associated with another record.";
                }
            }

            response.StatusCode = context.Response.StatusCode;
            response.ErrorMessage = message;

            return context.Response.WriteAsync(JsonConvert.SerializeObject(response, new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() }));
        }
    }
}
