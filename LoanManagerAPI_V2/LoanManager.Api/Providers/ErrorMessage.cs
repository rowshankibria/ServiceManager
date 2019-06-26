namespace LoanManager.Api.Providers
{
    public class ErrorMessage
    {
        public bool IsError { get; private set; }

        private string message;
        public string Message
        {
            get
            {
                return message;
            }
            set
            {
                IsError = false;
                if (!string.IsNullOrWhiteSpace(value))
                {
                    message = value;
                    IsError = true;
                }
            }
        }
    }
}
