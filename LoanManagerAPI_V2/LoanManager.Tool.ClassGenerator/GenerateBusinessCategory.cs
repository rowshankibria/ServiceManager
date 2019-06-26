using Itm.Tool.ClassGenerator.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text;

namespace Itm.Tool.ClassGenerator
{
    internal class GenerateBusinessCategory
    {
        internal void GenerateBusinessCategoryStruct()
        {
            DBContext dbcontext = new DBContext();
            var bcTypes = dbcontext.BusinessCategoryTypes.Include(x=>x.BusinessCategories);
            StringBuilder businessCategoryTypeBuilder = new StringBuilder();
            StringBuilder businessCategoryBuilder = new StringBuilder();
            
            businessCategoryTypeBuilder.Append($"using System;{Environment.NewLine}");
            businessCategoryTypeBuilder.AppendLine();

            businessCategoryTypeBuilder.Append($"namespace Itm.Configuration{Environment.NewLine}");
            businessCategoryTypeBuilder.Append("{").AppendLine();
            
            //Generate Application Business Category Type structure 
            businessCategoryTypeBuilder.Append("\t");
            businessCategoryTypeBuilder.Append($"public struct ApplicationBusinessCategoryType{Environment.NewLine}");
            businessCategoryTypeBuilder.Append("\t{").AppendLine();
            
            foreach (var bcType in bcTypes)
            {
                //Generate Application Business Category Type- Property 
                var entityName = bcType.Name.Replace(" ", "").Replace("&", "And").Replace(".", "_");

                businessCategoryTypeBuilder.Append("\t\t");
                businessCategoryTypeBuilder.Append("public static long " + entityName + " { get { return " + bcType.Id + "; } }").AppendLine();
                
                //Generate Business Category Struct
                businessCategoryBuilder.Append("\t");
                businessCategoryBuilder.Append($"public struct {entityName}{Environment.NewLine}");
                businessCategoryBuilder.Append("\t{").AppendLine();
                
                foreach (var bc in bcType.BusinessCategories)
                {
                    var bcName = bc.Name.Replace(", ", "_").Replace(" ", "").Replace("&", "And").Replace(".", "_").Replace(",", "_");
                    
                    businessCategoryBuilder.Append("\t\tpublic static long " + bcName + " { get { return " + bc.Id + "; } }").AppendLine();
                }

                businessCategoryBuilder.Append("\t}").AppendLine().AppendLine();
                //END Business Category Struct
            }

            businessCategoryTypeBuilder.Append("\t}").AppendLine().AppendLine();//END ApplicationBusinessCategoryType Struct
            
            businessCategoryTypeBuilder.Append(businessCategoryBuilder.ToString()); // Add Business Categories
            
            businessCategoryTypeBuilder.Append("}");//END Namespace 

            System.IO.StreamWriter file = new System.IO.StreamWriter(@"\ApplicationBusinessCategoryType.cs");
            file.WriteLine(businessCategoryTypeBuilder.ToString());
            file.Close();

            Console.WriteLine(businessCategoryTypeBuilder.ToString());
        }
    }
}