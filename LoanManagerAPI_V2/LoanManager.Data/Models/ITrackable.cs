using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Data.Models
{
    public interface ITrackable
    {
        DateTime CreatedDateTime { get; set; }
        long CreatedByContactId { get; set; }
        Contact CreatedByContact { get; set; }
        DateTime? LastUpdatedDateTime { get; set; }
        long? LastUpdatedByContactId { get; set; }
        Contact LastUpdatedByContact { get; set; }
    }
}
