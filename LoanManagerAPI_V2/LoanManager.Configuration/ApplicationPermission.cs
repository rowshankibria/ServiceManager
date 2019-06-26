using System;

namespace LoanManager.Configuration
{
    public struct ApplicationPermission
    {
        public static SystemClientRight Client { get { return new SystemClientRight(); } }
        public static SystemRegionRight Region { get { return new SystemRegionRight(); } }
        public static SystemBranchRight Branch { get { return new SystemBranchRight(); } }
        public static SystemEmployeeRight Employee { get { return new SystemEmployeeRight(); } }
        public static SystemHeadOfficeRight HeadOffice { get { return new SystemHeadOfficeRight(); } }
        public static SystemUserRight User { get { return new SystemUserRight(); } }
        public static SystemRoleRight Role { get { return new SystemRoleRight(); } }
        public static SystemConfigurationRight Configuration { get { return new SystemConfigurationRight(); } }
        public static SystemTypesAndCategoryRight TypesAndCategory { get { return new SystemTypesAndCategoryRight(); } }
        public static SystemApplicationRight Application { get { return new SystemApplicationRight(); } }
    }

    public class SystemClientRight
    {
        /// <summary>
        /// Show/Edit Client
        /// <summary>
        public int list_client { get { return 1010101; } }

    }

    public class SystemRegionRight
    {
        /// <summary>
        /// Show/Edit Region List
        /// <summary>
        public int list_region { get { return 1010201; } }

    }

    public class SystemBranchRight
    {
        /// <summary>
        /// Show/Edit Branch
        /// <summary>
        public int list_branch { get { return 1010301; } }

    }

    public class SystemEmployeeRight
    {
        /// <summary>
        /// Show/Edit Employee List
        /// <summary>
        public int list_employee { get { return 1020101; } }

    }

    public class SystemHeadOfficeRight
    {
        /// <summary>
        /// Show/Edit Head Office List
        /// <summary>
        public int list_business_profile { get { return 1030101; } }

    }

    public class SystemUserRight
    {
        /// <summary>
        /// Show/Edit User
        /// <summary>
        public int list_user { get { return 1030201; } }

    }

    public class SystemRoleRight
    {
        /// <summary>
        /// Show/Edit Role
        /// <summary>
        public int list_role { get { return 1030301; } }

    }

    public class SystemConfigurationRight
    {
        /// <summary>
        /// Show/Edit Configurations
        /// <summary>
        public int list_configurations { get { return 1030404; } }

    }

    public class SystemTypesAndCategoryRight
    {
        /// <summary>
        /// Show/Edit Types & Category
        /// <summary>
        public int list_type_n_category { get { return 1030501; } }

    }

    public class SystemApplicationRight
    {
        /// <summary>
        /// Show/Edit Loan Application
        /// <summary>
        public int list_application { get { return 1050101; } }

        /// <summary>
        /// Show/Edit Submited Loan Application
        /// <summary>
        public int list_submit_application { get { return 1050104; } }

    }

}
