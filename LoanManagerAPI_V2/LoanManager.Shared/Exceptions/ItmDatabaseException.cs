using System;
using System.Net;

namespace LoanManager.Shared
{
    [Serializable]
    public class ItmDatabaseException : ItmException
    {
        public ItmDatabaseException(string message)
            : base(message, (int)HttpStatusCode.InternalServerError)
        {
        }

        public ItmDatabaseException(string message, Exception innerException)
            : base(message, (int)HttpStatusCode.InternalServerError, innerException)
        {
        }

        public ItmDatabaseException(string format, params object[] args)
            : base(string.Format(format, args), (int)HttpStatusCode.InternalServerError)
        {
        }

        public ItmDatabaseException(Exception innerException, string format, params object[] args)
            : base(string.Format(format, args), (int)HttpStatusCode.InternalServerError, innerException)
        {
        }
    }
}
