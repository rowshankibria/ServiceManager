using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Configuration
{
    public class ApplicationEnvironment
    {
        public static string IMAGE_STORE_FOLDER_PUBLIC = "~/images/public";
        public static string PublicImageHostFolderPhysicalPath { get; set; }
        public static string PublicImageStoragePhysicalPath { get; set; }
        public static string AdminPortalDomainUrl { get; set; }        
        public static string PublicImageHostUrl { get; set; }
        public static bool DisableContentUrlMerge { get; set; } = true;
        public static bool DisableEmbedHtmlImages { get; set; } = true;

    }
}
