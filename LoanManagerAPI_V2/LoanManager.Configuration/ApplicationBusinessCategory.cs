using System;


namespace LoanManager.Configuration
{
    public struct ApplicationBusinessCategoryType
    {
        public static long ControlType { get { return 1; } }
        public static long ValidationType { get { return 2; } }
        public static long ZoneType { get { return 3; } }
        public static long ApproverGroupType { get { return 4; } }
        public static long ApprovalStatus { get { return 5; } }
        public static long NoteType { get { return 6; } }
    }

    public struct ControlType
    {
        public static long Textbox { get { return 1; } }
        public static long Combobox { get { return 2; } }
        public static long Checkbox { get { return 3; } }
        public static long Radiobutton { get { return 4; } }
        public static long MultilineTextbox { get { return 5; } }
        public static long DateControl { get { return 6; } }
        public static long Numberbox { get { return 7; } }
    }

    public struct ValidationType
    {
    }

    public struct ZoneType
    {
        public static long RegionalOffice { get { return 8; } }
        public static long BranchOffice { get { return 9; } }
        public static long HeadOffice { get { return 10; } }
    }

    public struct ApproverGroupType
    {
        public static long CreditOfficer { get { return 11; } }
        public static long BranchManager { get { return 12; } }
        public static long ClusterHead { get { return 13; } }
        public static long CreditOperation { get { return 14; } }
        public static long Risk_LegalAndCompliance { get { return 15; } }
        public static long DCEO_DGM
        {
            get { return 16; }
        }
        public static long CEO { get { return 17; } }
    }

    public struct ApprovalStatus
    {
        public static long NotStarted { get { return 18; } }
        public static long InProgress { get { return 19; } }
        public static long Review { get { return 20; } }
        public static long Accepted { get { return 21; } }
        public static long Rejected { get { return 22; } }
    }

    public struct NoteType
    {
        public static long SystemGenerated { get { return 23; } }
        public static long UserGenerated { get { return 24; } }
        public static long QuestionsAndAnswers { get { return 25; } }
    }
	
	public struct DeletableEntityType
    {
        public static int BusinessProfile { get { return 1; } }
        public static int LoanApplication { get { return 2; } }
        public static int Client { get { return 3; } }
        public static int Contact { get { return 4; } }
        public static int Employee { get { return 5; } }
        public static int Region { get { return 6; } }
        public static int Branch { get { return 7; } }
        public static int User { get { return 8; } }
        public static int Document { get { return 9; } }
        public static int DocumentCheckList { get { return 10; } }
        public static int LoanType { get { return 11; } }
        public static int ApprovalGroup { get { return 12; } }
        public static int ApprovalProcess { get { return 13; } }
        public static int TypesAndCategory { get { return 14; } }
    }
}