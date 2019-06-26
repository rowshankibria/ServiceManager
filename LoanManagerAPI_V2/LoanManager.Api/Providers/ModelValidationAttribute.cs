using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using LoanManager.Shared;

namespace LoanManager.Api.Providers
{
    [AttributeUsage(AttributeTargets.All, AllowMultiple = false)]
    public class ModelValidationAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                List<string> errors = new List<string>();
                foreach (ModelErrorCollection modelStateVal in context.ModelState.Values. Select(d => d.Errors))
                {
                    errors.AddRange(modelStateVal.Select(error => error.ErrorMessage));
                }

                ResponseMessage<bool> errorMessage =
                    new ResponseMessage<bool> { ErrorMessage = string.Join("<br>", errors.Select(x => x))};

                if (!string.IsNullOrWhiteSpace(errorMessage.ErrorMessage))
                {
                    context.Result = new BadRequestObjectResult(errorMessage);
                }
            }
        }
    }
}
