using Itm.Tool.ClassGenerator.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text;

namespace Itm.Tool.ClassGenerator
{
    internal class GenerateCustomCategory
    {
        internal void GenerateCustomCategoryStruct()
        {
            DBContext dbcontext = new DBContext();
            var entities = dbcontext.CustomCategoryTypes;
            StringBuilder entityBuilder = new StringBuilder();


            entityBuilder.Append($"using System;{Environment.NewLine}");
            entityBuilder.AppendLine();

            entityBuilder.Append($"namespace Itm.Configuration{Environment.NewLine}");
            entityBuilder.Append("{");
            entityBuilder.AppendLine();

            //Generate System Permission Entity structure 
            entityBuilder.Append("\t");
            entityBuilder.Append($"public struct ApplicationCustomCategory{Environment.NewLine}");
            entityBuilder.Append("\t");
            entityBuilder.Append("{");
            entityBuilder.AppendLine();

            foreach (var entity in entities)
            {
                //Generate System Permission Entity Class's Property 
                var entityName = entity.Name.Replace(" ", "").Replace("&", "And").Replace(".", "_");

                entityBuilder.Append("\t\t");
                entityBuilder.Append("public static int " + entityName + " { get { return " + entity.Id + "; } }");
                entityBuilder.AppendLine();
            }

            entityBuilder.Append("\t");
            entityBuilder.Append("}");
            entityBuilder.AppendLine();
            entityBuilder.AppendLine();

            entityBuilder.Append("}");

            System.IO.StreamWriter file = new System.IO.StreamWriter(@"\ApplicationCustomCategory.cs");
            file.WriteLine(entityBuilder.ToString());
            file.Close();

            Console.WriteLine(entityBuilder.ToString());
        }
    }
}