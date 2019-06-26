using LoanManager.ApplicationService.Models;
using LoanManager.Api.Providers;
using LoanManager.Shared;
using System.Collections.Generic;

namespace LoanManager.Api.Models
{
    public class BusinessProfileViewModel : BaseViewModel
    {
        public BusinessProfileModel BusinessProfileModel { get; set; }
        public BusinessProfileModel EmptyBusinessProfileModel { get; set; }
        public List<SelectModel> CountrySelectItems { get; set; }
    }
}
