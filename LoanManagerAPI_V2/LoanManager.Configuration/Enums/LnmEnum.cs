using LoanManager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Configuration.Enums
{
    /// <summary>
    /// User Identity Type
    /// </summary>
    public enum UserAuthenticationType
    {
        [StringValue("Site Default")]
        Default = -1,
        [StringValue("Database")]
        Database = 1,
        [StringValue("LDAP (Active Directory)")]
        LDAP = 2,
        [StringValue("Enterprise SSO")]
        EnterpriseSSO = 3
    }

    /// <summary>
    /// Determines the type of username.
    /// </summary>
    public enum UsernameType
    {
        [StringValue("Username")]
        Username = 0,
        [StringValue("Email")]
        Email = 1
    }

    public enum DocumentStorageType
    {
        [StringValue("Database")]
        FileSystem = 1,
        [StringValue("FileSystem")]
        Db = 2,
        [StringValue("Cloud")]
        Cloud = 3
    }

    /// <summary>
    /// 
    /// </summary>
    public enum GenderType
    {
        [StringValue("Male")]
        Male = 1,
        [StringValue("Female")]
        Female = 2
    }

    /// <summary>
    /// 
    /// </summary>
    public enum PreferredPhoneType
    {
        [StringValue("Business Phone")]
        Business_Phone = 1,
        [StringValue("Home Phone")]
        Home_Phone = 2,
        [StringValue("Mobile Phone")]
        Mobile_Phone = 3
    }

    /// <summary>
    /// 
    /// </summary>
    public enum ContactType
    {
        [StringValue("Contact")]
        Contact = 1,
        [StringValue("Employee")]
        Employee = 2,
        [StringValue("User")]
        User = 3,
        [StringValue("Client")]
        Client = 4
    }

    /// <summary>
    /// 
    /// </summary>
    public enum UserType
    {
        [StringValue("Employee")]
        Employee = 1,
        [StringValue("User")]
        User = 2,
        [StringValue("Contact")]
        Contact = 3
    }

    /// <summary>
    /// Enum EmailTemplateType
    /// </summary>
    public enum EnumEmailTemplateType
    {
        [StringValue("New Application")]
        NewApplication = 1,
        [StringValue("LoanApprovalRequest")]
        LoanApprovalRequest = 2,
        [StringValue("LoanAcceptance")]
        LoanAcceptance = 3,
        [StringValue("LoanRejection")]
        LoanRejection = 4,
        [StringValue("CommunicationLogs")]
        CommunicationLogs = 5,
    }
}
