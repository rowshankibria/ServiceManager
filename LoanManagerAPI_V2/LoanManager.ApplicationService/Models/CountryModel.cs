namespace LoanManager.ApplicationService.Models
{
    public class CountryModel
    {
        public long Id { get; set; }
        public string CountryName { get; set; }
        public string CountryCode { get; set; }
        public int? CurrencyId { get; set; }
    }
}
