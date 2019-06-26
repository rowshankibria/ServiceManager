"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This enum is used to identify which type of toolbar will be populated for a page
 **/
var ToolbarType;
(function (ToolbarType) {
    ToolbarType[ToolbarType["ListPage"] = 1] = "ListPage";
    ToolbarType[ToolbarType["ListTabPage"] = 2] = "ListTabPage";
    ToolbarType[ToolbarType["DetailPage"] = 3] = "DetailPage";
    ToolbarType[ToolbarType["DetailTabPage"] = 4] = "DetailTabPage";
    ToolbarType[ToolbarType["LinkPage"] = 5] = "LinkPage";
    ToolbarType[ToolbarType["TabPage"] = 6] = "TabPage";
})(ToolbarType = exports.ToolbarType || (exports.ToolbarType = {}));
var DetailPageAction;
(function (DetailPageAction) {
    DetailPageAction[DetailPageAction["Save"] = 1] = "Save";
    DetailPageAction[DetailPageAction["SaveAndNew"] = 2] = "SaveAndNew";
    DetailPageAction[DetailPageAction["SaveAndClose"] = 3] = "SaveAndClose";
    DetailPageAction[DetailPageAction["Close"] = 4] = "Close";
})(DetailPageAction = exports.DetailPageAction || (exports.DetailPageAction = {}));
var UserType;
(function (UserType) {
    UserType[UserType["Employee"] = 1] = "Employee";
    UserType[UserType["User"] = 2] = "User";
    UserType[UserType["Contact"] = 3] = "Contact";
})(UserType = exports.UserType || (exports.UserType = {}));
/**
 * Write all the possible pattern for the system we need [regular expression]
 * */
var PatterMatch = /** @class */ (function () {
    function PatterMatch() {
    }
    PatterMatch.EmailPattern = "\\w+([-+.']\\w+)*.?@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*";
    return PatterMatch;
}());
exports.PatterMatch = PatterMatch;
var ApprovalStatusMapType;
(function (ApprovalStatusMapType) {
    ApprovalStatusMapType[ApprovalStatusMapType["NotStarted"] = 18] = "NotStarted";
    ApprovalStatusMapType[ApprovalStatusMapType["InProgress"] = 19] = "InProgress";
    ApprovalStatusMapType[ApprovalStatusMapType["Review"] = 20] = "Review";
    ApprovalStatusMapType[ApprovalStatusMapType["Accepted"] = 21] = "Accepted";
    ApprovalStatusMapType[ApprovalStatusMapType["Rejected"] = 22] = "Rejected";
})(ApprovalStatusMapType = exports.ApprovalStatusMapType || (exports.ApprovalStatusMapType = {}));
var LoanStatusMapType;
(function (LoanStatusMapType) {
    LoanStatusMapType[LoanStatusMapType["NotStarted"] = 10] = "NotStarted";
    LoanStatusMapType[LoanStatusMapType["InProgress"] = 11] = "InProgress";
    LoanStatusMapType[LoanStatusMapType["Approved"] = 12] = "Approved";
    LoanStatusMapType[LoanStatusMapType["Rejected"] = 13] = "Rejected";
})(LoanStatusMapType = exports.LoanStatusMapType || (exports.LoanStatusMapType = {}));
var ApproverGroupTypeMapType;
(function (ApproverGroupTypeMapType) {
    ApproverGroupTypeMapType[ApproverGroupTypeMapType["CreditOfficer"] = 11] = "CreditOfficer";
    ApproverGroupTypeMapType[ApproverGroupTypeMapType["BranchManager"] = 12] = "BranchManager";
    ApproverGroupTypeMapType[ApproverGroupTypeMapType["ClusterHead"] = 13] = "ClusterHead";
    ApproverGroupTypeMapType[ApproverGroupTypeMapType["CreditOperation"] = 14] = "CreditOperation";
    ApproverGroupTypeMapType[ApproverGroupTypeMapType["Risk_LegalAndCompliance"] = 15] = "Risk_LegalAndCompliance";
    ApproverGroupTypeMapType[ApproverGroupTypeMapType["DCEO_DGM"] = 16] = "DCEO_DGM";
    ApproverGroupTypeMapType[ApproverGroupTypeMapType["CEO"] = 17] = "CEO";
})(ApproverGroupTypeMapType = exports.ApproverGroupTypeMapType || (exports.ApproverGroupTypeMapType = {}));
//# sourceMappingURL=utilities.js.map