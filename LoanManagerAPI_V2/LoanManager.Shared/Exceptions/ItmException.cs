using System;

namespace LoanManager.Shared
{
    [Serializable]
    public class ItmException : Exception
    {
        public ItmException(string message, int errorCode)
            : base(message)
        {
            HResult = errorCode;
        }

        public ItmException(string message, int errorCode, Exception innerException)
            : base(message, innerException)
        {
            HResult = errorCode;
        }
    }
}
