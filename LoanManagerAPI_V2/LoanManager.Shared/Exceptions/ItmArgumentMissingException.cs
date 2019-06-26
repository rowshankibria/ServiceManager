using System;
using System.Net;

namespace LoanManager.Shared
{
    [Serializable]
    public class ItmArgumentMissingException : ItmException
    {
        public ItmArgumentMissingException(string message)
            : base(message, (int)HttpStatusCode.BadRequest)
        {
        }

        public ItmArgumentMissingException(string format, params object[] args)
            : this(string.Format(format, args))
        {
        }
    }
}
