
/**
 * This enum is used to identify which type of toolbar will be populated for a page
 **/
export enum ToolbarType {
    ListPage = 1,
    ListTabPage = 2,
    DetailPage = 3,
    DetailTabPage = 4,
    LinkPage = 5,
    TabPage = 6,

}

export enum DetailPageAction {
    Save = 1,
    SaveAndNew = 2,
    SaveAndClose = 3,
    Close = 4
}

export enum UserType {
    Employee = 1,
    User = 2,
    Contact = 3,
}

/**
 * Write all the possible pattern for the system we need [regular expression]
 * */
export class PatterMatch {
    public static EmailPattern = "\\w+([-+.']\\w+)*.?@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*";
}


export enum ApprovalStatusMapType {

    NotStarted = 18,
    InProgress = 19,
    Review = 20,
    Accepted = 21,
    Rejected = 22,
}

export enum LoanStatusMapType {

    NotStarted = 10,
    InProgress = 11,
    Approved = 12,
    Rejected = 13,
}


export enum ApproverGroupTypeMapType {
    CreditOfficer = 11,
    BranchManager = 12,
    ClusterHead = 13,
    CreditOperation = 14,
    Risk_LegalAndCompliance = 15,
    DCEO_DGM = 16,
    CEO = 17,
}

