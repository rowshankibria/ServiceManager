using System;
using System.Net;

namespace LoanManager.Shared
{
    [Serializable]
    public class ItmInternalServerException : ItmException
    {
        public ItmInternalServerException(string message)
            : base(message, (int)HttpStatusCode.InternalServerError)
        {
        }

        public ItmInternalServerException(string format, params object[] args)
            : base(string.Format(format, args), (int)HttpStatusCode.InternalServerError)
        {
        }

    }
}
