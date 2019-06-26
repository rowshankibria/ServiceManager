using System;
using System.Net;

namespace LoanManager.Shared
{
    [Serializable]
    public class ItmUnauthorizedException : ItmException
    {
        public ItmUnauthorizedException(string message)
            : base(message, (int)HttpStatusCode.Unauthorized)
        {
        }

        public ItmUnauthorizedException(string format, params object[] args)
            : base(string.Format(format, args), (int)HttpStatusCode.Unauthorized)
        {
        }

    }
}
