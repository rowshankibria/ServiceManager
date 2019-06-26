using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using LoanManager.Web.Api;
using LoanManager.Api;
using LoanManager.ApplicationService;
using LoanManager.Data;
using LoanManager.Shared;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Swashbuckle.AspNetCore.Swagger;

namespace LoanManager.Web.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            #region Content Negotiator

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1).AddJsonOptions(options =>
            {
                options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                options.SerializerSettings.DefaultValueHandling = DefaultValueHandling.Include;
                options.SerializerSettings.NullValueHandling = NullValueHandling.Include;

                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                options.SerializerSettings.PreserveReferencesHandling = PreserveReferencesHandling.None;
            });

            #endregion            

            #region Dependencies Resolver

            services.AddTransient<IHttpContextAccessor, HttpContextAccessor>();
            services.AddMvcCore().AddApplicationPart(Assembly.Load(new AssemblyName("LoanManager.Api"))).AddControllersAsServices();
            services.AddMvcCore().AddApplicationPart(Assembly.Load(new AssemblyName("LoanManager.Api.Crm"))).AddControllersAsServices();

            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(Configurations.ApplicationConnectionString));
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

            services.AddTransient<IApplicationCacheService, ApplicationCacheService>();
            services.AddTransient<IApplicationMenuService, ApplicationMenuService>();
            services.AddTransient<IApplicationPageService, ApplicationPageService>();
            services.AddTransient<IBusinessCategoryService, BusinessCategoryService>();
            services.AddTransient<IBusinessProfileService, BusinessProfileService>();
            services.AddTransient<IContactService, ContactService>();
            services.AddTransient<ICustomCategoryService, CustomCategoryService>();
            services.AddTransient<IPhotoService, PhotoService>();
            services.AddTransient<IRoleService, RoleService>();
            services.AddTransient<ISharedService, SharedService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<ILoanApplicationService, LoanApplicationService>();
            services.AddTransient<ILoanTypeService, LoanTypeService>();
            services.AddTransient<ILoggedInUserService, LoggedInUserService>();
            services.AddTransient<IStoredProcedureRepository, StoredProcedureRepository>();
            services.AddTransient<IBranchService, BranchService>();
            services.AddTransient<ICompanyService, CompanyService>();
            services.AddTransient<IEmployeeService, EmployeeService>();
            services.AddTransient<IApproverGroupService, ApproverGroupService>();
            services.AddTransient<IApprovalProcessService, ApprovalProcessService>();
            services.AddTransient<IChecklistTypeService, ChecklistTypeService>();

            #endregion

            #region Auto Mapper


            services.AddAutoMapper();
            MapperConfiguration mapperConfiguration = new MapperConfiguration(config =>
            {
                config.AddProfile<ApiDataMappingProfile>();
                config.AddProfile<ApiServiceMappingProfile>();



            });
            mapperConfiguration.CreateMapper();
            services.AddSingleton(mapperConfiguration);


            #endregion

            #region Swagger

            //Integrate Swagger
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info
                {
                    Version = "v1",
                    Title = "Loan Manager API",
                    Description = "Loan Manager API",
                    TermsOfService = "None",
                    Contact = new Contact() { Name = "Loan Manager", Email = "contact@loanmanager.com", Url = "www.loanmanager.com" }
                });

                // Set the comments path for the Swagger JSON and UI.
                //var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                //var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                //c.IncludeXmlComments(xmlPath);

                string filePath = Path.Combine(AppContext.BaseDirectory, "LoanManager.Web.Api.xml");
                c.IncludeXmlComments(filePath);

                filePath = Path.Combine(AppContext.BaseDirectory, "LoanManager.Api.xml");
                c.IncludeXmlComments(filePath);

                filePath = Path.Combine(AppContext.BaseDirectory, "LoanManager.Api.Crm.xml");
                c.IncludeXmlComments(filePath);

            });



            #endregion

            #region CORS Configuration

            string[] applicationAllowedUrls = { "http://localhost:8088", "http://localhost:4200", "http://loanadmin.pyxidaapps.com", "http://loanclient.pyxidaapps.com" }; //Configurations.ApplicationAllowedUrls;
            services.AddCors();
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.WithOrigins(applicationAllowedUrls)
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials()
                    );
                options.AddPolicy("AllowHeaders",
                    builder =>
                    {
                        builder.WithOrigins(applicationAllowedUrls)
                               .AllowAnyOrigin()
                               .WithHeaders(HeaderNames.ContentType, "x-custom-header", HeaderNames.ContentDisposition);
                    });
            });

            #endregion

            #region JWT Token

            //string Issuer = Configuration.GetSection("AuthCredentials").GetSection("Issuer").Value;
            //string Audience = Configuration.GetSection("AuthCredentials").GetSection("Audience").Value;
            //string SigningKey = Configuration.GetSection("AuthCredentials").GetSection("SigningKey").Value;

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(jwtBearerOptions =>
            {
                jwtBearerOptions.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateActor = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = Configurations.AuthenticationCredentialIssuer,
                    ValidAudience = Configurations.AuthenticationCredentialAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configurations.AuthenticationCredentialSignKey))
                };
            });

            #endregion
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseAuthentication();
            app.UseHttpsRedirection();

            //don't use on production env
            //app.UseCors(builder =>
            //    builder.AllowAnyOrigin()
            //);
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseCors("CorsPolicy");
            app.UseCors("AllowHeaders");


            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.EnableFilter();
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Loan Manager API V1");
                c.ShowExtensions();
            });

            app.UseMiddleware(typeof(ExceptionMiddleware));
            app.UseMvcWithDefaultRoute();
        }
    }
}
