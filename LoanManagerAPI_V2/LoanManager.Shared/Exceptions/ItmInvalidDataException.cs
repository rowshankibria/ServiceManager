using System;
using System.Net;

namespace LoanManager.Shared
{
    [Serializable]
    public class ItmInvalidDataException : ItmException
    {
        public ItmInvalidDataException(string message)
            : base(message, (int)HttpStatusCode.BadRequest)
        {
        }

        public ItmInvalidDataException(string format, params object[] args) :
            this(string.Format(format, args))
        {

        }
    }
}
