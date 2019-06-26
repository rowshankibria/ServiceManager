using System;
using System.IO;

namespace Itm.Tool.ClassGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            GetArgument();




            Console.ReadLine();

        }

        private static void GetArgument()
        {
            int argument;
            Console.WriteLine("1 = Generate Permission Classes");
            Console.WriteLine("2 = Generate MapType Classes");
            Console.WriteLine("3 = Generate EntityType struct");
            Console.WriteLine("4 = Generate CustomCategory struct");
            Console.WriteLine("5 = Generate BusinessCategory struct");
            Console.WriteLine("6 = Generate Application Service Interface Method");


            Console.WriteLine("Please enter a numeric argument");
            if (int.TryParse(Console.ReadLine(), out argument))
            {
                switch (argument)
                {
                    case 1:

                        GeneratePermission generatePermission = new GeneratePermission();
                        generatePermission.GeneratePermissionClasses();
                        Console.WriteLine("Completed");

                        break;
                    case 2:

                        GenerateMapType generateMapType = new GenerateMapType();
                        generateMapType.GenerateMapTypeClasses();
                        Console.WriteLine("Completed");

                        break;
                    case 3:

                        GenerateEntityType generateEntityType = new GenerateEntityType();
                        generateEntityType.GenerateEntityTypeStruct();
                        Console.WriteLine("Completed");

                        break;
                    case 4:

                        GenerateCustomCategory generateCustomCategory = new GenerateCustomCategory();
                        generateCustomCategory.GenerateCustomCategoryStruct();
                        Console.WriteLine("Completed");

                        break;
                    case 5:

                        GenerateBusinessCategory generateBusinessCategory = new GenerateBusinessCategory();
                        generateBusinessCategory.GenerateBusinessCategoryStruct();
                        Console.WriteLine("Completed");

                        break;

                    case 6:

                        Console.WriteLine("Please enter a Entity Class Name");
                        
                        GenerateApplicationServiceInterface generateApplicationServiceInterface = new GenerateApplicationServiceInterface();
                        generateApplicationServiceInterface.GenerateApplicationServiceInterfaceMethod(Console.ReadLine());
                        Console.WriteLine("Completed");

                        break;

                    default:

                        Console.WriteLine("Invalid argument");
                        GetArgument();

                        break;
                }
            }
            else
            {
                Console.WriteLine("Invalid argument");
                GetArgument();
            }
        }

        private static void NewMethod()
        {
            string codeBase = System.Reflection.Assembly.GetExecutingAssembly().CodeBase;
            string fullPath = codeBase.Substring(0, codeBase.LastIndexOf("bin")) + "SystemPermission.cs";

            Console.WriteLine(fullPath);
            GeneratePermission generatePermission = new GeneratePermission();
            generatePermission.GeneratePermissionClasses();
            Console.WriteLine("Completed");
        }
    }
}
