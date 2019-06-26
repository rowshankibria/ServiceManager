namespace LoanManager.Shared
{
    public class ResponseMessage<T>
    {
        private string _errorMessage;

        public T Result { get; set; }
        public string Message { get; set; }

        public MessageType MessageType { get; set; }
        public bool IsError { get; private set; }
        public int StatusCode { get; set; }
        public string ErrorMessage
        {
            get => _errorMessage;
            set
            {
                IsError = false;
                if (string.IsNullOrWhiteSpace(value))
                {
                    return;
                }

                _errorMessage = value;
                IsError = true;
            }
        }
    }

    public enum MessageType
    {
        [StringValue("Information")]
        Information = 1,
        [StringValue("Warning")]
        Warning = 2
    }
}
