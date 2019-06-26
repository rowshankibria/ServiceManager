using Itm.Tool.ClassGenerator.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text;

namespace Itm.Tool.ClassGenerator
{
    public class GeneratePermission
    {

        internal void GeneratePermissionClasses()
        {
            DBContext dbcontext = new DBContext();
            var entities = dbcontext.SystemEntitys.Include(r => r.SystemEntityRight);
            StringBuilder entityBuilder = new StringBuilder();
            StringBuilder rightBuilder = new StringBuilder();

            entityBuilder.Append($"using System;{Environment.NewLine}");
            entityBuilder.AppendLine();

            entityBuilder.Append($"namespace Itm.Configuration{Environment.NewLine}");
            entityBuilder.Append("{");
            entityBuilder.AppendLine();

            //Generate System Permission Entity structure 
            entityBuilder.Append("\t");
            entityBuilder.Append($"public struct ApplicationPermission{Environment.NewLine}");
            entityBuilder.Append("\t");
            entityBuilder.Append("{");
            entityBuilder.AppendLine();

            foreach (var entity in entities)
            {
                //Generate System Permission Entity Property 
                var entityName = entity.EntityName.Replace(" ", "").Replace("&", "And").Replace(".", "_");

                entityBuilder.Append("\t\t");
                entityBuilder.Append("public static System" + entityName + "Right " + entityName + " { get { return new System" + entityName + "Right(); } }");
                entityBuilder.AppendLine();

                //Generate System Permission Entity right Classes
                BuildEntityRightClasses(rightBuilder, entity, entityName);
            }

            entityBuilder.Append("\t");
            entityBuilder.Append("}");
            entityBuilder.AppendLine();
            entityBuilder.AppendLine();

            entityBuilder.Append(rightBuilder.ToString());

            entityBuilder.Append("}");

            System.IO.StreamWriter file = new System.IO.StreamWriter(@"\ApplicationPermission.cs");
            file.WriteLine(entityBuilder.ToString());
            file.Close();

            Console.WriteLine(entityBuilder.ToString());
        }

        private static void BuildEntityRightClasses(StringBuilder rightBuilder, SystemEntity entity, string entityName)
        {
            rightBuilder.Append("\t");
            rightBuilder.Append($"public class System{entityName}Right{ Environment.NewLine}");
            rightBuilder.Append("\t");
            rightBuilder.Append("{");
            rightBuilder.AppendLine();

            foreach (var right in entity.SystemEntityRight)
            {
                var rightKey = right.RightKey.Replace("’", "").Replace("'", "").Replace("-", "_").Replace("(", "_").Replace(")", "");

                rightBuilder.Append("\t\t/// <summary>");
                rightBuilder.AppendLine();
                rightBuilder.AppendFormat("\t\t/// {0}", right.Name);
                rightBuilder.AppendLine();
                rightBuilder.Append("\t\t/// <summary>");
                rightBuilder.AppendLine();
                rightBuilder.Append("\t\t");
                rightBuilder.Append("public int " + rightKey + " { get { return " + right.Id.ToString() + "; } }");
                rightBuilder.AppendLine();
                rightBuilder.AppendLine();
            }

            rightBuilder.Append("\t");
            rightBuilder.Append("}");
            rightBuilder.AppendLine();
            rightBuilder.AppendLine();
        }
    }

    public struct SystemPermission
    {
        public static SystemUserRight User = new SystemUserRight();


    }

    public class SystemUserRight
    {
        /// <summary>
        /// Show System User Detail
        /// </summary>
        public int DetailViewRightId { get { return 10107; } }
    }



    public class SystemRight
    {
        public string EntityName { get; set; }
        public int EntityId { get; set; }
        public string RightName { get; set; }
        public int PermissionId { get; set; }


    }
}

