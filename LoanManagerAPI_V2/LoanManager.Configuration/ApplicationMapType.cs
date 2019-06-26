using System;

namespace LoanManager.Configuration
{
    public struct ApplicationMapType
    {
        public static RatingTypeMapType RatingType { get { return new RatingTypeMapType(); } }
        public static PositionMapType Position { get { return new PositionMapType(); } }
        public static LoanStatusTypeMapType LoanStatusType { get { return new LoanStatusTypeMapType(); } }
        public static ApprovalStatusTypeMapType ApprovalStatusType { get { return new ApprovalStatusTypeMapType(); } }
        public static PostingZoneTypeMapType PostingZoneType { get { return new PostingZoneTypeMapType(); } }
        public static DepartmentTypeMapType DepartmentType { get { return new DepartmentTypeMapType(); } }
    }

    public class RatingTypeMapType
    {
        /// <summary>
        /// Platinum:
        /// <summary>
        public int Platinum { get { return 1; } }

        /// <summary>
        /// Gold:
        /// <summary>
        public int Gold { get { return 2; } }

        /// <summary>
        /// Silver:
        /// <summary>
        public int Silver { get { return 3; } }

    }

    public class PositionMapType
    {
        /// <summary>
        /// Credit Officer:
        /// <summary>
        public int CreditOfficer { get { return 4; } }

        /// <summary>
        /// Branch Manager:
        /// <summary>
        public int BranchManager { get { return 5; } }

        /// <summary>
        /// Cluster Head:
        /// <summary>
        public int ClusterHead { get { return 22; } }

        /// <summary>
        /// Credit Operation Head:
        /// <summary>
        public int CreditOperationHead { get { return 23; } }

        /// <summary>
        /// Risk Officer:
        /// <summary>
        public int RiskOfficer { get { return 24; } }

        /// <summary>
        /// Legal Officer:
        /// <summary>
        public int LegalOfficer { get { return 25; } }

        /// <summary>
        /// Compliance Officer:
        /// <summary>
        public int ComplianceOfficer { get { return 26; } }

        /// <summary>
        /// DCEO/DGM CEO:
        /// <summary>
        public int DCEO_DGMCEO
        {
            get { return 27; }
        }

        /// <summary>
        /// Credit Administration Processor Officer:
        /// <summary>
        public int CreditAdministrationProcessorOfficer { get { return 28; } }

        /// <summary>
        /// Credit Administration Head:
        /// <summary>
        public int CreditAdministrationHead { get { return 29; } }

        public int CEO { get { return 30; } }
    }

    public class LoanStatusTypeMapType
    {
        /// <summary>
        /// Submitted:
        /// <summary>
        public int Submitted { get { return 6; } }

        /// <summary>
        /// In Progress:
        /// <summary>
        public int InProgress { get { return 7; } }

        /// <summary>
        /// Approved:
        /// <summary>
        public int Approved { get { return 8; } }

        /// <summary>
        /// Rejected:
        /// <summary>
        public int Rejected { get { return 9; } }

    }

    public class ApprovalStatusTypeMapType
    {
        /// <summary>
        /// Not Started:
        /// <summary>
        public int NotStarted { get { return 10; } }

        /// <summary>
        /// In Progress:
        /// <summary>
        public int InProgress { get { return 11; } }

        /// <summary>
        /// Approved:
        /// <summary>
        public int Approved { get { return 12; } }

        /// <summary>
        /// Rejected:
        /// <summary>
        public int Rejected { get { return 13; } }

    }

    public class PostingZoneTypeMapType
    {
        /// <summary>
        /// Regional Office:
        /// <summary>
        public int RegionalOffice { get { return 14; } }

        /// <summary>
        /// Branch Office:
        /// <summary>
        public int BranchOffice { get { return 15; } }

        /// <summary>
        /// Head Office:
        /// <summary>
        public int HeadOffice { get { return 16; } }

    }

    public class DepartmentTypeMapType
    {
        /// <summary>
        /// Head Office:
        /// <summary>
        public int HeadOffice { get { return 17; } }

        /// <summary>
        /// Branch Office:
        /// <summary>
        public int BranchOffice { get { return 18; } }

        /// <summary>
        /// Credit Operations:
        /// <summary>
        public int CreditOperations { get { return 19; } }

        /// <summary>
        /// Risk Legal & Compliance:
        /// <summary>
        public int RiskLegalNCompliance { get { return 20; } }

        /// <summary>
        /// Credit Administration:
        /// <summary>
        public int CreditAdministration { get { return 21; } }

    }

}