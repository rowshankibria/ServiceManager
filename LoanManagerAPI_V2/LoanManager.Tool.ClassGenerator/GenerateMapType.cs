using Itm.Tool.ClassGenerator.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text;

namespace Itm.Tool.ClassGenerator
{
    public class GenerateMapType
    {
        internal void GenerateMapTypeClasses()
        {
            DBContext dbcontext = new DBContext();
            var entities = dbcontext.CustomCategoryMapTypes.Include(r => r.CustomCategoryMapTypeOptions);
            StringBuilder mapTypeBuilder = new StringBuilder();
            StringBuilder mapTypeOptionBuilder = new StringBuilder();

            mapTypeBuilder.Append($"using System;{Environment.NewLine}");
            mapTypeBuilder.AppendLine();

            mapTypeBuilder.Append($"namespace Itm.Configuration{Environment.NewLine}");
            mapTypeBuilder.Append("{");
            mapTypeBuilder.AppendLine();

            //Generate Map Type structure 
            mapTypeBuilder.Append("\t");
            mapTypeBuilder.Append($"public struct ApplicationMapType{Environment.NewLine}");
            mapTypeBuilder.Append("\t");
            mapTypeBuilder.Append("{");
            mapTypeBuilder.AppendLine();

            foreach (var entity in entities)
            {
                //Generate Map Typ Property 
                var entityName = entity.Name.Replace(" ", "").Replace("&", "And").Replace(".", "_");

                mapTypeBuilder.Append("\t\t");
                mapTypeBuilder.Append("public static " + entityName + "MapType " + entityName + " { get { return new " + entityName + "MapType(); } }");
                mapTypeBuilder.AppendLine();

                //Generate Map Type Option Classes
                BuildEntityRightClasses(mapTypeOptionBuilder, entity, entityName);
            }

            mapTypeBuilder.Append("\t");
            mapTypeBuilder.Append("}");
            mapTypeBuilder.AppendLine();
            mapTypeBuilder.AppendLine();

            mapTypeBuilder.Append(mapTypeOptionBuilder.ToString());

            mapTypeBuilder.Append("}");

            System.IO.StreamWriter file = new System.IO.StreamWriter(@"\ApplicationMapType.cs");
            file.WriteLine(mapTypeBuilder.ToString());
            file.Close();

            Console.WriteLine(mapTypeBuilder.ToString());
        }

        private static void BuildEntityRightClasses(StringBuilder maptypeOptionBuilder, CustomCategoryMapType mapType, string entityName)
        {
            maptypeOptionBuilder.Append("\t");
            maptypeOptionBuilder.Append($"public class {entityName}MapType{Environment.NewLine}");
            maptypeOptionBuilder.Append("\t");
            maptypeOptionBuilder.Append("{");
            maptypeOptionBuilder.AppendLine();

            foreach (var option in mapType.CustomCategoryMapTypeOptions)
            {
                var optionName = option.Name.Replace("’", "").Replace("'", "").Replace("-", "_").Replace("(", "_").Replace(")", "").Replace(" ", "");

                maptypeOptionBuilder.Append("\t\t/// <summary>");
                maptypeOptionBuilder.AppendLine();
                maptypeOptionBuilder.Append($"\t\t/// {option.Name}: {option.Description}");
                maptypeOptionBuilder.AppendLine();
                maptypeOptionBuilder.Append("\t\t/// <summary>");
                maptypeOptionBuilder.AppendLine();
                maptypeOptionBuilder.Append("\t\t");
                maptypeOptionBuilder.Append("public int " + optionName + " { get { return " + option.Id.ToString() + "; } }");
                maptypeOptionBuilder.AppendLine();
                maptypeOptionBuilder.AppendLine();
            }

            maptypeOptionBuilder.Append("\t");
            maptypeOptionBuilder.Append("}");
            maptypeOptionBuilder.AppendLine();
            maptypeOptionBuilder.AppendLine();
        }
    }
}
