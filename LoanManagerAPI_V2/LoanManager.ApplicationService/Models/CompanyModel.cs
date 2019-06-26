using LoanManager.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService.Models
{
    public class CompanyModel
    {
        public CompanyModel()
        {
            RelationshipTypes = new List<int>();
            //Logo = new PhotoModel();
            CompanyContactIds = new List<int>();
        }
        public int Id { get; set; }
        public string CompanyName { get; set; }
        public string AccountNumber { get; set; }
        public string TradeAs { get; set; }
        public int? FinancialOptionId { get; set; }
        public string Abn { get; set; }
        public string Acn { get; set; }
        public string MainPhone { get; set; }
        public string MobilePhone { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string Website { get; set; }
        public int? LogoId { get; set; }
        public int? CountryId { get; set; }
        public int? StateId { get; set; }
        public bool? IsActive { get; set; }
        public int? IndustryTypeId { get; set; }
        public int? CompanyTypeId { get; set; }
        public int? RatingTypeId { get; set; }
        public int? NoOfEmployee { get; set; }
        public int? PrimaryContactId { get; set; }
        public decimal? AnnualTurnover { get; set; }
        public string Description { get; set; }
        public bool IsArchived { get; set; }
        public int? PreferredContactMethodId { get; set; }
        public string TimeZoneId { get; set; }
        public string ExternalPartnerId { get; set; }
        public int BusinessProfileId { get; set; }
        public string Street { get; set; }
        public string Suburb { get; set; }
        public string PostCode { get; set; }
        public PhotoModel Logo { get; set; }
        public List<int> RelationshipTypes { get; set; }
        public List<int> CompanyContactIds { get; set; }
    }
}
