using System;
using System.Collections.Generic;
using System.Text;

namespace Itm.Tool.ClassGenerator
{
    public class GenerateApplicationServiceInterface
    {
        internal void GenerateApplicationServiceInterfaceMethod(string entityName)
        {
            
            StringBuilder businessCategoryTypeBuilder = new StringBuilder();

            businessCategoryTypeBuilder.AppendLine()
                .Append("\t\t")
                .AppendLine("#region Get List")
                .Append("\t\t")
                .AppendLine($"Task<LoadResult> Get{entityName}ListAsync(DataSourceLoadOptionsBase options);")
                .Append("\t\t")
                .AppendLine("#endregion").AppendLine()
                .Append("\t\t")
                .AppendLine("#region Get Single Entity")
                .Append("\t\t")
                .AppendLine($"Task<EmailTemplate> Get{entityName}ByIdAsync(int id);")
                .Append("\t\t")
                .AppendLine("#endregion").AppendLine()
                .Append("\t\t")
                .AppendLine("#region CUD")
                .Append("\t\t")
                .AppendLine($"Task<int> Save{entityName}Async(int id, EmailTemplateModel model);")
                .Append("\t\t")
                .AppendLine($"Task<int> Delete{entityName}Async(int id);")
                .Append("\t\t")
                .AppendLine($"Task<bool> Delete{entityName}sAsync(List<int> ids);")
                .Append("\t\t")
                .AppendLine("#endregion")
                 
                ;


            //System.IO.StreamWriter file = new System.IO.StreamWriter(@"\ApplicationBusinessCategoryType.cs");
            //file.WriteLine(businessCategoryTypeBuilder.ToString());
            //file.Close();

            Console.WriteLine(businessCategoryTypeBuilder.ToString());
        }
    }
}
