using System;
using System.Net;

namespace LoanManager.Shared
{
    [Serializable]
    public class ItmNotFoundException : ItmException
    {
        public ItmNotFoundException(string message)
            : base(message, (int)HttpStatusCode.NotFound)
        {
        }

        public ItmNotFoundException(string format, params object[] args)
            : this(string.Format(format, args))
        {
        }
    }
}
