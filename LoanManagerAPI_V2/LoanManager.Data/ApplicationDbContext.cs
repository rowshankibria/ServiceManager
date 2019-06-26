using LoanManager.Data.Models;
using LoanManager.Data.StoredProcedureModel;
using Microsoft.EntityFrameworkCore;

namespace LoanManager.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext()
        {
        }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public virtual DbQuery<LoanApplicationSummary> ApplicationSummaries { get; set; }
        public virtual DbQuery<LoanApplicationBranchSummary> ApplicationBranchSummaries { get; set; }
        public virtual DbQuery<LoanApplicationTotalSummary> ApplicationTotalSummaries { get; set; }
        public virtual DbQuery<DeleteValidationSummary> DeleteValidationSummaries { get; set; }


        public virtual DbSet<Address> Addresses { get; set; }
        public virtual DbSet<ApplicationDocument> ApplicationDocuments { get; set; }
        public virtual DbSet<ApprovalEntityMapping> ApprovalEntityMappings { get; set; }
        public virtual DbSet<ApprovalEntityMappingChecklist> ApprovalEntityMappingChecklists { get; set; }
        public virtual DbSet<ApprovalProcess> ApprovalProcesses { get; set; }
        public virtual DbSet<ApprovalProcessStep> ApprovalProcessSteps { get; set; }
        public virtual DbSet<ApprovalProcessStepChecklist> ApprovalProcessStepChecklists { get; set; }
        public virtual DbSet<ApproverGroup> ApproverGroups { get; set; }
        public virtual DbSet<ApproverGroupMember> ApproverGroupMembers { get; set; }
        public virtual DbSet<Branch> Branches { get; set; }
        public virtual DbSet<BusinessCategory> BusinessCategories { get; set; }
        public virtual DbSet<BusinessCategoryType> BusinessCategoryTypes { get; set; }
        public virtual DbSet<BusinessProfile> BusinessProfiles { get; set; }
        public virtual DbSet<Company> Companies { get; set; }
        public virtual DbSet<LoanManager.Data.Models.Configuration> Configurations { get; set; }
        public virtual DbSet<Contact> Contacts { get; set; }
        public virtual DbSet<Country> Countries { get; set; }
        public virtual DbSet<Currency> Currencies { get; set; }
        public virtual DbSet<CustomCategory> CustomCategories { get; set; }
        public virtual DbSet<CustomCategoryMapType> CustomCategoryMapTypes { get; set; }
        public virtual DbSet<CustomCategoryMapTypeOption> CustomCategoryMapTypeOptions { get; set; }
        public virtual DbSet<CustomCategoryType> CustomCategoryTypes { get; set; }
        public virtual DbSet<Department> Departments { get; set; }
        public virtual DbSet<Document> Documents { get; set; }
        public virtual DbSet<DocumentChecklist> DocumentChecklists { get; set; }
        public virtual DbSet<DocumentExtension> DocumentExtensions { get; set; }
        public virtual DbSet<Employee> Employees { get; set; }
        public virtual DbSet<EntityAddressList> EntityAddressLists { get; set; }
        public virtual DbSet<EntityType> EntityTypes { get; set; }
        public virtual DbSet<LoanApplication> LoanApplications { get; set; }
        public virtual DbSet<LoanDocumentType> LoanDocumentTypes { get; set; }
        public virtual DbSet<LoanType> LoanTypes { get; set; }
        public virtual DbSet<LoanTypeApprovalProcess> LoanTypeApprovalProcesses { get; set; }
        public virtual DbSet<Note> Notes { get; set; }
        public virtual DbSet<EmailTemplate> EmailTemplates { get; set; }
        public virtual DbSet<EmailHistory> EmailHistories { get; set; }
        public virtual DbSet<Photo> Photoes { get; set; }
        public virtual DbSet<PublicHoliday> PublicHolidays { get; set; }
        public virtual DbSet<SecurityConfiguration> SecurityConfigurations { get; set; }
        public virtual DbSet<SecurityProfile> SecurityProfiles { get; set; }
        public virtual DbSet<Server> Servers { get; set; }
        public virtual DbSet<State> States { get; set; }
        public virtual DbSet<SystemEntity> SystemEntities { get; set; }
        public virtual DbSet<SystemEntityRight> SystemEntityRights { get; set; }
        public virtual DbSet<SystemEntityRightDependency> SystemEntityRightDependencies { get; set; }
        public virtual DbSet<SystemModule> SystemModules { get; set; }
        public virtual DbSet<SystemRole> SystemRoles { get; set; }
        public virtual DbSet<SystemRoleRight> SystemRoleRights { get; set; }
        public virtual DbSet<SystemUser> SystemUsers { get; set; }
        public virtual DbSet<SystemUserRole> SystemUserRoles { get; set; }
        public virtual DbSet<TimeZone> TimeZones { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Address>(entity =>
            {
                entity.ToTable("Address", "service");

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.PostCode).HasMaxLength(200);

                entity.Property(e => e.Street).IsUnicode(false);

                entity.Property(e => e.Suburb)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.TimeStamp).IsRowVersion();

                entity.HasOne(d => d.Country)
                    .WithMany(p => p.Addresses)
                    .HasForeignKey(d => d.CountryId);

                entity.HasOne(d => d.State)
                    .WithMany(p => p.Addresses)
                    .HasForeignKey(d => d.StateId);

                entity.HasOne(d => d.Type)
                    .WithMany(p => p.Addresses)
                    .HasForeignKey(d => d.TypeId);
            });

            modelBuilder.Entity<ApplicationCustomField>(entity =>
            {
                entity.ToTable("ApplicationCustomField", "loan");

                entity.Property(e => e.Value).IsUnicode(false);

                entity.HasOne(d => d.CustomFieldMaster)
                    .WithMany(p => p.ApplicationCustomFields)
                    .HasForeignKey(d => d.CustomFieldMasterId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.LoanApplication)
                    .WithMany(p => p.ApplicationCustomFields)
                    .HasForeignKey(d => d.LoanApplicationId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.ValueOption)
                    .WithMany(p => p.ApplicationCustomFields)
                    .HasForeignKey(d => d.ValueOptionId);
            });

            modelBuilder.Entity<ApplicationDocument>(entity =>
            {
                entity.ToTable("ApplicationDocument", "dms");

                entity.HasOne(d => d.Application)
                    .WithMany(p => p.ApplicationDocuments)
                    .HasForeignKey(d => d.ApplicationId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.Document)
                    .WithMany(p => p.ApplicationDocuments)
                    .HasForeignKey(d => d.DocumentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DMSEntityDocumentList_DMSDocument");
            });

            modelBuilder.Entity<ApplicationMenu>(entity =>
            {
                entity.ToTable("ApplicationMenu", "core");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.ApplicationName)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Caption)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.HelpText)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.ImageSource)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.IsVisible)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.NavigateUrl)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.HasOne(d => d.Page)
                    .WithMany(p => p.ApplicationMenus)
                    .HasForeignKey(d => d.PageId)
                    .HasConstraintName("FK_ApplicationMenu_ApplicationPage");

                entity.HasOne(d => d.Parent)
                    .WithMany(p => p.InverseParent)
                    .HasForeignKey(d => d.ParentId)
                    .HasConstraintName("FK_ApplicationMenu_ApplicationMenu_Parent");
            });

            modelBuilder.Entity<ApplicationPage>(entity =>
            {
                entity.ToTable("ApplicationPage", "core");

                entity.HasIndex(e => e.Name)
                    .HasName("UK_ApplicationPage_Name")
                    .IsUnique();

                entity.HasIndex(e => e.RoutingUrl)
                    .HasName("UK_ApplicationPage_RoutingUrl")
                    .IsUnique();

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.PageType)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.RoutingUrl)
                    .IsRequired()
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.HasOne(d => d.Parent)
                    .WithMany(p => p.InverseParent)
                    .HasForeignKey(d => d.ParentId)
                    .HasConstraintName("FK_ApplicationPage_ApplicationPage");
            });

            modelBuilder.Entity<ApplicationPageFieldDetail>(entity =>
            {
                entity.ToTable("ApplicationPageFieldDetail", "core");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Alignment)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Left')");

                entity.Property(e => e.Caption)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.CellTemplate)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ColumnFilterEnabled)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.DataType)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.DefaultSortOrder)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('undefined')");

                entity.Property(e => e.Format)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.ReadOnly)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.RowFilterEnabled)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.SortEnabled)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Visible)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.HasOne(d => d.Page)
                    .WithMany(p => p.ApplicationPageFieldDetails)
                    .HasForeignKey(d => d.PageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ApplicationPageFieldDetail_ApplicationPage");
            });

            modelBuilder.Entity<ApplicationPageNavigation>(entity =>
            {
                entity.ToTable("ApplicationPageNavigation", "core");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.LinkName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.NavigateUrl)
                    .IsRequired()
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.HasOne(d => d.Page)
                    .WithMany(p => p.ApplicationPageNavigations)
                    .HasForeignKey(d => d.PageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ApplicationPageNavigation_ApplicationPage");
            });

            modelBuilder.Entity<ApplicationPageService>(entity =>
            {
                entity.ToTable("ApplicationPageService", "core");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.ServiceName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ServiceType)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.ServiceUrl)
                    .IsRequired()
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.HasOne(d => d.Page)
                    .WithMany(p => p.ApplicationPageServices)
                    .HasForeignKey(d => d.PageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ApplicationPageService_ApplicationPage");
            });

            modelBuilder.Entity<ApprovalEntityMapping>(entity =>
            {
                entity.ToTable("ApprovalEntityMapping", "loan");

                entity.Property(e => e.Description)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.EntityName)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.LastActionDate).HasColumnType("datetime");

                entity.HasOne(d => d.Application)
                    .WithMany(p => p.ApprovalEntityMappings)
                    .HasForeignKey(d => d.ApplicationId);

                entity.HasOne(d => d.ApprovalProcess)
                    .WithMany(p => p.ApprovalEntityMappings)
                    .HasForeignKey(d => d.ApprovalProcessId);

                entity.HasOne(d => d.ApprovalProcessStep)
                    .WithMany(p => p.ApprovalEntityMappings)
                    .HasForeignKey(d => d.ApprovalProcessStepId);

                entity.HasOne(d => d.LastActionByNavigation)
                    .WithMany(p => p.ApprovalEntityMappings)
                    .HasForeignKey(d => d.LastActionBy);

                entity.HasOne(d => d.ApproverGroup)
                   .WithMany(p => p.ApprovalEntityMappings)
                   .HasForeignKey(d => d.ApproverGroupId);

                entity.HasOne(d => d.Status)
                  .WithMany(p => p.ApprovalEntityMappings)
                  .HasForeignKey(d => d.StatusId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<ApprovalEntityMappingChecklist>(entity =>
            {
                entity.ToTable("ApprovalEntityMappingChecklist", "loan");

                entity.HasOne(d => d.ApprovalEntityMapping)
                    .WithMany(p => p.ApprovalEntityMappingChecklists)
                    .HasForeignKey(d => d.ApprovalEntityMappingId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.ApprovalProcessStepChecklistNavigation)
                    .WithMany(p => p.ApprovalEntityMappingChecklists)
                    .HasForeignKey(d => d.ApprovalProcessStepChecklistId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.ApproverGroup)
                    .WithMany(p => p.ApprovalEntityMappingChecklists)
                    .HasForeignKey(d => d.ApproverGroupId);
            });

            modelBuilder.Entity<ApprovalProcess>(entity =>
            {
                entity.ToTable("ApprovalProcess", "loan");

                // entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ApprovalProcessStep>(entity =>
            {
                entity.ToTable("ApprovalProcessStep", "loan");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.HasOne(d => d.ApprovalProcess)
                    .WithMany(p => p.ApprovalProcessSteps)
                    .HasForeignKey(d => d.ApprovalProcessId);

                entity.HasOne(d => d.ApproverGroup)
                    .WithMany(p => p.ApprovalProcessSteps)
                    .HasForeignKey(d => d.ApproverGroupId);
            });

            modelBuilder.Entity<ApprovalProcessStepChecklist>(entity =>
            {
                entity.ToTable("ApprovalProcessStepChecklist", "loan");

                entity.HasOne(d => d.ApprovalProcessStep)
                    .WithMany(p => p.ApprovalProcessStepChecklists)
                    .HasForeignKey(d => d.ApprovalProcessStepId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.DocumentChecklist)
                    .WithMany(p => p.ApprovalProcessStepChecklists)
                    .HasForeignKey(d => d.DocumentChecklistId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<ApproverGroup>(entity =>
            {
                entity.ToTable("ApproverGroup", "loan");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.HasOne(d => d.ApproverGroupType)
                  .WithMany(p => p.ApproverGroups)
                  .HasForeignKey(d => d.ApproverGroupTypeId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<ApproverGroupMember>(entity =>
            {
                entity.ToTable("ApproverGroupMember", "loan");

                entity.HasOne(d => d.ApprovalGroup)
                    .WithMany(p => p.ApproverGroupMembers)
                    .HasForeignKey(d => d.ApprovalGroupId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.ApproverGroupMembers)
                    .HasForeignKey(d => d.EmployeeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<Branch>(entity =>
            {
                entity.ToTable("Branch", "crm");

                entity.Property(e => e.Address).IsUnicode(false);

                entity.Property(e => e.BranchCode)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.BranchName)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Email)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Fax)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Phone)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.HasOne(d => d.Company)
                    .WithMany(p => p.Branches)
                    .HasForeignKey(d => d.CompanyId);
            });

            modelBuilder.Entity<BusinessCategory>(entity =>
            {
                entity.ToTable("BusinessCategory", "core");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.ActionKey)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Description)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.HasOne(d => d.BusinessCategoryType)
                    .WithMany(p => p.BusinessCategories)
                    .HasForeignKey(d => d.BusinessCategoryTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<BusinessCategoryType>(entity =>
            {
                entity.ToTable("BusinessCategoryType", "core");

                entity.HasIndex(e => e.Name)
                    .HasName("UK_BusinessCategoryType_Name")
                    .IsUnique();

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<BusinessProfile>(entity =>
            {
                entity.ToTable("BusinessProfile", "core");

                entity.Property(e => e.Abn)
                    .HasColumnName("ABN")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Acn)
                    .HasColumnName("ACN")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.ApplicationUrl)
                    .HasColumnName("ApplicationURL")
                    .HasMaxLength(300)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDateTime)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Email)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Fax)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.LastUpdatedDateTime).HasColumnType("datetime");

                entity.Property(e => e.Mobile)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Number)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Phone)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.SecondaryEmail)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.SecondaryPhone)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.TimeStamp).IsRowVersion();

                entity.Property(e => e.TimeZoneId)
                    .HasColumnName("TimeZoneID")
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UseSameConfigForPayrollIntegration)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Website)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.HasOne(d => d.Logo)
                    .WithMany(p => p.BusinessProfiles)
                    .HasForeignKey(d => d.LogoId);

                entity.Property(e => e.Street)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Suburb)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.PostalCode)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.HasOne(d => d.Country)
                    .WithMany(p => p.BusinessProfiles)
                    .HasForeignKey(d => d.CountryId);
            });

            modelBuilder.Entity<Company>(entity =>
            {
                entity.ToTable("Company", "crm");

                entity.Property(e => e.Abn)
                    .HasColumnName("ABN")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.AccountNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Acn)
                    .HasColumnName("ACN")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.AnnualTurnover).HasColumnType("numeric(18, 2)");

                entity.Property(e => e.CompanyName)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDateTime)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Description).IsUnicode(false);

                entity.Property(e => e.Email)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.ExternalPartnerId)
                    .HasColumnName("ExternalPartnerID")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Fax)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.LastUpdatedDateTime).HasColumnType("datetime");

                entity.Property(e => e.MainPhone)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.MobilePhone)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TimeStamp).IsRowVersion();

                entity.Property(e => e.TimeZoneId)
                    .HasColumnName("TimeZoneID")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TradeAs)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Website)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                //entity.HasOne(d => d.BusinessProfile)
                //    .WithMany(p => p.Companies)
                //    .HasForeignKey(d => d.BusinessProfileId)
                //    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.CompanyType)
                    .WithMany(p => p.CompanyCompanyTypes)
                    .HasForeignKey(d => d.CompanyTypeId)
                    .HasConstraintName("FK_Company_CustomCategory_CompanyType");

                entity.HasOne(d => d.Country)
                    .WithMany(p => p.Companies)
                    .HasForeignKey(d => d.CountryId);

                entity.HasOne(d => d.CreatedByContact)
                    .WithMany(p => p.CompanyCreatedByContacts)
                    .HasForeignKey(d => d.CreatedByContactId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.IndustryType)
                    .WithMany(p => p.CompanyIndustryTypes)
                    .HasForeignKey(d => d.IndustryTypeId)
                    .HasConstraintName("FK_Company_CustomCategory_IndustryType");

                entity.HasOne(d => d.LastUpdatedByContact)
                    .WithMany(p => p.CompanyLastUpdatedByContacts)
                    .HasForeignKey(d => d.LastUpdatedByContactId);

                entity.HasOne(d => d.Logo)
                    .WithMany(p => p.Companies)
                    .HasForeignKey(d => d.LogoId)
                    .HasConstraintName("FK_Company_Photo");

                entity.HasOne(d => d.PreferredContactMethod)
                    .WithMany(p => p.CompanyPreferredContactMethods)
                    .HasForeignKey(d => d.PreferredContactMethodId)
                    .HasConstraintName("FK_Company_CustomCategory_PreferredContactMethod");

                entity.HasOne(d => d.PrimaryContact)
                    .WithMany(p => p.CompanyPrimaryContacts)
                    .HasForeignKey(d => d.PrimaryContactId);

                entity.HasOne(d => d.RatingType)
                    .WithMany(p => p.CompanyRatingTypes)
                    .HasForeignKey(d => d.RatingTypeId)
                    .HasConstraintName("FK_Company_CustomCategory_Rating");

                entity.HasOne(d => d.State)
                    .WithMany(p => p.Companies)
                    .HasForeignKey(d => d.StateId);
            });

            modelBuilder.Entity<LoanManager.Data.Models.Configuration>(entity =>
            {
                entity.ToTable("Configuration", "core");

                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                entity.Property(e => e.BusinessProfileId).HasDefaultValueSql("((1))");

                entity.Property(e => e.TimeStamp).IsRowVersion();

                //entity.HasOne(d => d.BusinessProfile)
                //    .WithMany(p => p.Configurations)
                //    .HasForeignKey(d => d.BusinessProfileId)
                //    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.IdNavigation)
                    .WithOne(p => p.InverseIdNavigation)
                    .HasForeignKey<LoanManager.Data.Models.Configuration>(d => d.Id)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Configuration_Configuration");
            });

            modelBuilder.Entity<Contact>(entity =>
            {
                entity.ToTable("Contact", "core");

                entity.Property(e => e.BusinessPhone).HasMaxLength(50);

                entity.Property(e => e.CitizenIssueDate).HasColumnType("date");

                entity.Property(e => e.CitizenIssueDistrictName).HasMaxLength(200);

                entity.Property(e => e.CitizenNo).HasMaxLength(100);

                entity.Property(e => e.CreatedDateTime)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.DateOfBirth).HasColumnType("date");

                entity.Property(e => e.Description).IsUnicode(false);

                entity.Property(e => e.DrivingLicenseIssueDate).HasColumnType("date");

                entity.Property(e => e.DrivingLicenseIssueDistrictName).HasMaxLength(200);

                entity.Property(e => e.DrivingLicenseNo).HasMaxLength(100);

                entity.Property(e => e.Email).HasMaxLength(100);

                entity.Property(e => e.Email2).HasMaxLength(100);

                entity.Property(e => e.Email3).HasMaxLength(100);

                entity.Property(e => e.EmergencyContactEmail).HasMaxLength(100);

                entity.Property(e => e.EmergencyContactName).HasMaxLength(100);

                entity.Property(e => e.EmergencyContactNumber).HasMaxLength(50);

                entity.Property(e => e.EmergencyContactRelation).HasMaxLength(200);

                entity.Property(e => e.Fax).HasMaxLength(50);

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.FullName).HasMaxLength(200);

                entity.Property(e => e.HomePhone).HasMaxLength(50);

                entity.Property(e => e.ImLoginId).HasMaxLength(50);

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.LastUpdatedDateTime).HasColumnType("datetime");

                entity.Property(e => e.MiddleName).HasMaxLength(50);

                entity.Property(e => e.Mobile).HasMaxLength(50);

                entity.Property(e => e.PassportIssueCountryName).HasMaxLength(100);

                entity.Property(e => e.PassportIssueDate).HasColumnType("date");

                entity.Property(e => e.PassportNo).HasMaxLength(100);

                entity.Property(e => e.PermanentDistrict).HasMaxLength(200);

                entity.Property(e => e.PermanentHouseNo).HasMaxLength(100);

                entity.Property(e => e.PermanentMunicipality).HasMaxLength(200);

                entity.Property(e => e.PermanentTole).HasMaxLength(100);

                entity.Property(e => e.PermanentWardNo).HasMaxLength(100);

                entity.Property(e => e.PreferredName).HasMaxLength(50);

                entity.Property(e => e.PresentDistrict).HasMaxLength(200);

                entity.Property(e => e.PresentHouseNo).HasMaxLength(100);

                entity.Property(e => e.PresentMunicipality).HasMaxLength(200);

                entity.Property(e => e.PresentTole).HasMaxLength(100);

                entity.Property(e => e.PresentWardNo).HasMaxLength(100);

                entity.Property(e => e.SpecialInstruction).HasMaxLength(400);

                entity.Property(e => e.TimeStamp).IsRowVersion();

                entity.Property(e => e.TimeZoneId).HasMaxLength(200);

                entity.Property(e => e.VoterCertificateIssueDate).HasColumnType("date");

                entity.Property(e => e.VoterCertificateIssueDistrictName).HasMaxLength(200);

                entity.Property(e => e.VoterCertificateNo).HasMaxLength(100);

                entity.Property(e => e.Website).HasMaxLength(200);

                entity.HasOne(d => d.Branch)
                  .WithMany(p => p.Contacts)
                  .HasForeignKey(d => d.BranchId);

                entity.HasOne(d => d.BusinessProfile)
                    .WithMany(p => p.Contacts)
                    .HasForeignKey(d => d.BusinessProfileId);

                entity.HasOne(d => d.Company)
                    .WithMany(p => p.Contacts)
                    .HasForeignKey(d => d.CompanyId);

                entity.HasOne(d => d.Gender)
                    .WithMany(p => p.ContactGenders)
                    .HasForeignKey(d => d.GenderId);

                entity.HasOne(d => d.ImType)
                    .WithMany(p => p.ContactImTypes)
                    .HasForeignKey(d => d.ImTypeId);

                entity.HasOne(d => d.Photo)
                    .WithMany(p => p.Contacts)
                    .HasForeignKey(d => d.PhotoId);

                entity.HasOne(d => d.PostingZone)
                    .WithMany(p => p.Contacts)
                    .HasForeignKey(d => d.PostingZoneId);

                entity.HasOne(d => d.Postion)
                    .WithMany(p => p.ContactPostions)
                    .HasForeignKey(d => d.PostionId);

                entity.HasOne(d => d.PreferredContactMethod)
                    .WithMany(p => p.ContactPreferredContactMethods)
                    .HasForeignKey(d => d.PreferredContactMethodId);

                entity.HasOne(d => d.Title)
                    .WithMany(p => p.ContactTitles)
                    .HasForeignKey(d => d.TitleId);
            });

            modelBuilder.Entity<Country>(entity =>
            {
                entity.ToTable("Country", "core");

                entity.Property(e => e.CountryCode)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.CountryName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Currency>(entity =>
            {
                entity.ToTable("Currency", "service");

                entity.Property(e => e.DisplayName).HasMaxLength(200);

                entity.Property(e => e.ExchangeRate).HasColumnType("decimal(18, 10)");

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Isocode)
                    .IsRequired()
                    .HasColumnName("ISOCode")
                    .HasMaxLength(3);

                entity.Property(e => e.LastUpdatedOn).HasColumnType("datetime");

                entity.Property(e => e.Precision).HasDefaultValueSql("((2))");

                entity.Property(e => e.Symbol).HasMaxLength(200);

                entity.Property(e => e.TimeStamp).IsRowVersion();
            });

            modelBuilder.Entity<CustomCategory>(entity =>
            {
                entity.ToTable("CustomCategory", "core");

                entity.Property(e => e.Code)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Desciption)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.HasOne(d => d.CustomCategoryMapTypeOption)
                    .WithMany(p => p.CustomCategories)
                    .HasForeignKey(d => d.CustomCategoryMapTypeOptionId);

                entity.HasOne(d => d.CustomCategoryType)
                    .WithMany(p => p.CustomCategories)
                    .HasForeignKey(d => d.CustomCategoryTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<CustomCategoryMapType>(entity =>
            {
                entity.ToTable("CustomCategoryMapType", "core");

                entity.HasIndex(e => e.Name)
                    .HasName("UK_CustomCategoryMapType")
                    .IsUnique();

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Description)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<CustomCategoryMapTypeOption>(entity =>
            {
                entity.ToTable("CustomCategoryMapTypeOption", "core");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Description)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.HasOne(d => d.CustomCategoryMapType)
                    .WithMany(p => p.CustomCategoryMapTypeOptions)
                    .HasForeignKey(d => d.CustomCategoryMapTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<CustomCategoryType>(entity =>
            {
                entity.ToTable("CustomCategoryType", "core");

                entity.HasIndex(e => e.RoutingKey)
                    .HasName("UK_CustomCategoryType_RoutingKey")
                    .IsUnique();

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.HelpText).IsUnicode(false);

                entity.Property(e => e.ImageSource)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.ModuleName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.RoutingKey)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.Right)
                    .WithMany(p => p.CustomCategoryTypes)
                    .HasForeignKey(d => d.RightId);
            });

            modelBuilder.Entity<CustomFieldControlValueOption>(entity =>
            {
                entity.ToTable("CustomFieldControlValueOption", "core");

                entity.Property(e => e.CustomFieldValueOption)
                    .IsRequired()
                    .IsUnicode(false);

                entity.HasOne(d => d.CustomFieldMaster)
                    .WithMany(p => p.CustomFieldControlValueOptions)
                    .HasForeignKey(d => d.CustomFieldMasterId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<CustomFieldMaster>(entity =>
            {
                entity.ToTable("CustomFieldMaster", "core");

                entity.Property(e => e.Caption).IsRequired();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.HasOne(d => d.ControlType)
                    .WithMany(p => p.CustomFieldMasters)
                    .HasForeignKey(d => d.ControlTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.Entity)
                    .WithMany(p => p.CustomFieldMasters)
                    .HasForeignKey(d => d.EntityId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.EntityType)
                    .WithMany(p => p.CustomFieldMasters)
                    .HasForeignKey(d => d.EntityTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<CustomFieldValidation>(entity =>
            {
                entity.ToTable("CustomFieldValidation", "core");

                entity.Property(e => e.ValidationErrorMessage).IsUnicode(false);

                entity.HasOne(d => d.CustomFieldMaster)
                    .WithMany(p => p.CustomFieldValidations)
                    .HasForeignKey(d => d.CustomFieldMasterId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.ValidationType)
                    .WithMany(p => p.CustomFieldValidations)
                    .HasForeignKey(d => d.ValidationTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<Department>(entity =>
            {
                entity.ToTable("Department", "crm");

                entity.Property(e => e.DepartmentName)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Description).IsUnicode(false);

                entity.Property(e => e.TimeStamp).IsRowVersion();
            });

            modelBuilder.Entity<Document>(entity =>
            {
                entity.ToTable("Document", "dms");

                entity.Property(e => e.DateAdded).HasColumnType("datetime");

                entity.Property(e => e.Description).IsUnicode(false);

                entity.Property(e => e.FileName)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.FileSize)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.OrginalFile).IsRequired();

                entity.Property(e => e.OrginalFileName)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.TimeStamp).IsRowVersion();

                entity.Property(e => e.Title)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.HasOne(d => d.Application)
                   .WithMany(p => p.Documents)
                   .HasForeignKey(d => d.ApplicationId)
                   .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.DocumentCategory)
                   .WithMany(p => p.Documents)
                   .HasForeignKey(d => d.DocumentCategoryId)
                   .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<DocumentChecklist>(entity =>
            {
                entity.ToTable("DocumentChecklist", "dms");

                entity.Property(e => e.Description)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(400)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<DocumentExtension>(entity =>
            {
                entity.ToTable("DocumentExtension", "dms");

                entity.Property(e => e.Description).IsUnicode(false);

                entity.Property(e => e.Extension)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.TimeStamp).IsRowVersion();
            });

            modelBuilder.Entity<Employee>(entity =>
            {
                entity.ToTable("Employee", "hrm");

                entity.Property(e => e.CommenceDate).HasColumnType("datetime");

                entity.Property(e => e.DeskId)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.EmployeeId)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Floor)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.JobCeasedDate).HasColumnType("datetime");

                entity.Property(e => e.JobDescription).IsUnicode(false);

                entity.Property(e => e.ProbitionEndingDate).HasColumnType("datetime");

                entity.Property(e => e.ReasonJobCeased).IsUnicode(false);

                entity.Property(e => e.TimeStamp).IsRowVersion();

                entity.Property(e => e.VisaExpiryDate).HasColumnType("datetime");

                entity.HasOne(d => d.Contact)
                    .WithMany(p => p.Employees)
                    .HasForeignKey(d => d.ContactId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.Department)
                    .WithMany(p => p.EmployeeDepartments)
                    .HasForeignKey(d => d.DepartmentId);

                entity.HasOne(d => d.EmploymentType)
                    .WithMany(p => p.EmployeeEmploymentTypes)
                    .HasForeignKey(d => d.EmploymentTypeId);

                entity.HasOne(d => d.Supervisor)
                    .WithMany(p => p.InverseSupervisor)
                    .HasForeignKey(d => d.SupervisorId)
                    .HasConstraintName("FK_HRMEmployee_HRMEmployee_SupervisorId");
            });

            modelBuilder.Entity<EntityAddressList>(entity =>
            {
                entity.ToTable("EntityAddressList", "service");

                entity.Property(e => e.TimeStamp).IsRowVersion();

                entity.HasOne(d => d.Address)
                    .WithMany(p => p.EntityAddressLists)
                    .HasForeignKey(d => d.AddressId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.EntityType)
                    .WithMany(p => p.EntityAddressLists)
                    .HasForeignKey(d => d.EntityTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<EntityType>(entity =>
            {
                entity.ToTable("EntityType", "core");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Description)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<LoanApplication>(entity =>
            {
                entity.ToTable("LoanApplication", "loan");

                entity.Property(e => e.ApplicationDate).HasColumnType("date");

                entity.Property(e => e.ApplicationId)
                    .IsRequired()
                    .HasColumnName("ApplicationID")
                    .HasMaxLength(100);

                entity.Property(e => e.DateOfIssue).HasColumnType("date");

                entity.Property(e => e.Description).HasMaxLength(400);

                entity.Property(e => e.ProcessStartDate).HasColumnType("date");

                entity.Property(e => e.TimeStamp).IsRowVersion();

                entity.HasOne(d => d.ApplicationStatus)
                    .WithMany(p => p.LoanApplications)
                    .HasForeignKey(d => d.ApplicationStatusId);

                entity.HasOne(d => d.ApproverCurrentGroup)
                   .WithMany(p => p.LoanApplications)
                   .HasForeignKey(d => d.ApproverCurrentGroupId);

                entity.HasOne(d => d.Branch)
                    .WithMany(p => p.LoanApplications)
                    .HasForeignKey(d => d.BranchId);

                entity.HasOne(d => d.Contact)
                    .WithMany(p => p.LoanApplications)
                    .HasForeignKey(d => d.ContactId);

                entity.HasOne(d => d.LoanType)
                    .WithMany(p => p.LoanApplications)
                    .HasForeignKey(d => d.LoanTypeId);

                entity.HasOne(d => d.AssignedEmployee)
                   .WithMany(p => p.LoanApplicationAssignedEmployees)
                   .HasForeignKey(d => d.AssignedEmployeeId);

                entity.HasOne(d => d.CurrentAssignedEmployee)
                      .WithMany(p => p.LoanApplicationCurrentAssignedEmployees)
                      .HasForeignKey(d => d.CurrentAssignedEmployeeId);
            });

            modelBuilder.Entity<LoanDocumentType>(entity =>
            {
                entity.ToTable("LoanDocumentType", "loan");                

                entity.HasOne(d => d.CategoryType)
                    .WithMany(p => p.LoanDocumentTypes)
                    .HasForeignKey(d => d.CategoryTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.LoanType)
                    .WithMany(p => p.LoanDocumentTypes)
                    .HasForeignKey(d => d.LoanTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<LoanType>(entity =>
            {
                entity.ToTable("LoanType", "loan");

                entity.Property(e => e.Description)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<LoanTypeApprovalProcess>(entity =>
            {
                entity.ToTable("LoanTypeApprovalProcess", "loan");

                entity.HasOne(d => d.ApprovalProcess)
                    .WithMany(p => p.LoanTypeApprovalProcesses)
                    .HasForeignKey(d => d.ApprovalProcessId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.LoanType)
                    .WithMany(p => p.LoanTypeApprovalProcesses)
                    .HasForeignKey(d => d.LoanTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<Note>(entity =>
            {
                entity.ToTable("Note", "service");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp).IsRowVersion();

                entity.HasOne(d => d.CreatedByContact)
                    .WithMany(p => p.Notes)
                    .HasForeignKey(d => d.CreatedByContactId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.EntityType)
                    .WithMany(p => p.Notes)
                    .HasForeignKey(d => d.EntityTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.NoteType)
                  .WithMany(p => p.Notes)
                  .HasForeignKey(d => d.NoteTypeId);

                entity.HasOne(d => d.AssignedByEmployee)
                  .WithMany(p => p.NoteAssignedByEmployees)
                  .HasForeignKey(d => d.AssignedByEmployeeId);

                entity.HasOne(d => d.AssignedToEmployee)
                    .WithMany(p => p.NoteAssignedToEmployees)
                    .HasForeignKey(d => d.AssignedToEmployeeId);
            });

            modelBuilder.Entity<Photo>(entity =>
            {
                entity.ToTable("Photo", "service");

                entity.Property(e => e.Description)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.DisplayOrder).HasDefaultValueSql("((1))");

                entity.Property(e => e.FileName)
                    .IsRequired()
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.FileSizeInKb).HasColumnName("FileSizeInKB");

                entity.Property(e => e.OrginalFileName).IsUnicode(false);

                entity.Property(e => e.TimeStamp).IsRowVersion();
            });

            modelBuilder.Entity<EmailTemplate>(entity =>
            {
                entity.ToTable("EmailTemplate", "service");
            });

            modelBuilder.Entity<EmailHistory>(entity =>
            {
                entity.ToTable("EmailHistory", "service");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp).IsRowVersion();

                entity.HasOne(d => d.CreatedByContact)
                    .WithMany(p => p.EmailHistories)
                    .HasForeignKey(d => d.CreatedByContactId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.EntityType)
                    .WithMany(p => p.EmailHistories)
                    .HasForeignKey(d => d.EntityTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<PublicHoliday>(entity =>
            {
                entity.ToTable("PublicHoliday", "core");

                entity.HasIndex(e => new { e.Date, e.CountryId, e.StateId })
                    .HasName("UN_SYSPublicHoliday")
                    .IsUnique();

                entity.Property(e => e.Date).HasColumnType("datetime");

                entity.Property(e => e.EventName).HasMaxLength(200);

                entity.Property(e => e.Timestamp).IsRowVersion();

                entity.HasOne(d => d.Country)
                    .WithMany(p => p.PublicHolidays)
                    .HasForeignKey(d => d.CountryId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.State)
                    .WithMany(p => p.PublicHolidays)
                    .HasForeignKey(d => d.StateId);
            });

            modelBuilder.Entity<SecurityConfiguration>(entity =>
            {
                entity.ToTable("SecurityConfiguration", "security");

                entity.Property(e => e.EnableSessionLog)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.EnableSso).HasColumnName("EnableSSO");

                entity.Property(e => e.MaximumImageUploadSizeInKb).HasColumnName("MaximumImageUploadSizeInKB");

                entity.Property(e => e.TimeStamp).IsRowVersion();

                //entity.HasOne(d => d.BusinessProfile)
                //    .WithMany(p => p.SecurityConfigurations)
                //    .HasForeignKey(d => d.BusinessProfileId);
            });

            modelBuilder.Entity<SecurityProfile>(entity =>
            {
                entity.ToTable("SecurityProfile", "security");

                entity.Property(e => e.Descriptions).IsUnicode(false);

                entity.Property(e => e.ProfileName)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Server>(entity =>
            {
                entity.ToTable("Server", "core");

                entity.Property(e => e.CopyToEmailAddress)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.DisplayName)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.OutgoingServer)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Password).IsUnicode(false);

                entity.Property(e => e.ReplyToEmailAddress)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.SenderId)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.SenderName)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.TimeStamp).IsRowVersion();

                entity.Property(e => e.UseSslforOutgoing).HasColumnName("UseSSLForOutgoing");

                entity.Property(e => e.UserName)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.HasOne(d => d.AuthenticationType)
                    .WithMany(p => p.ServerAuthenticationTypes)
                    .HasForeignKey(d => d.AuthenticationTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                //entity.HasOne(d => d.BusinessProfile)
                //    .WithMany(p => p.Servers)
                //    .HasForeignKey(d => d.BusinessProfileId)
                //    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.Protocol)
                    .WithMany(p => p.ServerProtocols)
                    .HasForeignKey(d => d.ProtocolId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.SenderOption)
                    .WithMany(p => p.ServerSenderOptions)
                    .HasForeignKey(d => d.SenderOptionId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<State>(entity =>
            {
                entity.ToTable("State", "core");

                entity.Property(e => e.Description)
                    .HasMaxLength(800)
                    .IsUnicode(false);

                entity.Property(e => e.StateName)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.TimeStamp).IsRowVersion();

                entity.HasOne(d => d.Country)
                    .WithMany(p => p.States)
                    .HasForeignKey(d => d.CountryId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<SystemEntity>(entity =>
            {
                entity.ToTable("SystemEntity", "security");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Description)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.EntityName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.TimeStamp).IsRowVersion();

                entity.HasOne(d => d.Module)
                    .WithMany(p => p.SystemEntities)
                    .HasForeignKey(d => d.ModuleId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<SystemEntityRight>(entity =>
            {
                entity.ToTable("SystemEntityRight", "security");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Description)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.RightKey)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TimeStamp).IsRowVersion();

                entity.HasOne(d => d.Entity)
                    .WithMany(p => p.SystemEntityRights)
                    .HasForeignKey(d => d.EntityId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<SystemEntityRightDependency>(entity =>
            {
                entity.ToTable("SystemEntityRightDependency", "security");

                entity.HasOne(d => d.DependentRight)
                    .WithMany(p => p.SystemEntityRightDependencyDependentRights)
                    .HasForeignKey(d => d.DependentRightId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.Right)
                    .WithMany(p => p.SystemEntityRightDependencyRights)
                    .HasForeignKey(d => d.RightId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<SystemModule>(entity =>
            {
                entity.HasKey(e => e.ModuleId);

                entity.ToTable("SystemModule", "security");

                entity.Property(e => e.ModuleId).ValueGeneratedNever();

                entity.Property(e => e.Description)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.ModuleName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.TimeStamp).IsRowVersion();
            });

            modelBuilder.Entity<SystemRole>(entity =>
            {
                entity.ToTable("SystemRole", "security");

                entity.Property(e => e.CreatedDateTime)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Description)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.LastUpdatedDateTime).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.TimeStamp).IsRowVersion();
            });

            modelBuilder.Entity<SystemRoleRight>(entity =>
            {
                entity.ToTable("SystemRoleRight", "security");

                entity.HasOne(d => d.Right)
                    .WithMany(p => p.SystemRoleRights)
                    .HasForeignKey(d => d.RightId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ApplicationRoleRight_SystemEntityRight_RightId");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.SystemRoleRights)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<SystemUser>(entity =>
            {
                entity.ToTable("SystemUser", "security");

                entity.Property(e => e.CreatedDateTime)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.LastUpdatedDateTime).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp).IsRowVersion();

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.Contact)
                    .WithMany(p => p.SystemUserContacts)
                    .HasForeignKey(d => d.ContactId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.CreatedByContact)
                    .WithMany(p => p.SystemUserCreatedByContacts)
                    .HasForeignKey(d => d.CreatedByContactId);

                entity.HasOne(d => d.SecurityProfile)
                    .WithMany(p => p.SystemUsers)
                    .HasForeignKey(d => d.SecurityProfileId)
                    .HasConstraintName("FK_SystemUser_SystemUser_SecurityProfileId");
            });

            modelBuilder.Entity<SystemUserRole>(entity =>
            {
                entity.ToTable("SystemUserRole", "security");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.SystemUserRoles)
                    .HasForeignKey(d => d.RoleId);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.SystemUserRoles)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<TimeZone>(entity =>
            {
                entity.ToTable("TimeZone", "core");

                entity.Property(e => e.Id)
                    .HasMaxLength(200)
                    .ValueGeneratedNever();

                entity.Property(e => e.DaylightDisplayName).HasMaxLength(200);

                entity.Property(e => e.DaylightSavingEndDateTime).HasColumnType("datetime");

                entity.Property(e => e.DaylightSavingStartDateTime).HasColumnType("datetime");

                entity.Property(e => e.DisplayName).HasMaxLength(200);
            });
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //optionsBuilder.UseSqlServer(ItmConfigurations.IdentityServerConnectionString);
            //optionsBuilder.UseSqlServer(@"data source=.;initial catalog=TestDb;user id=sa;password=Test123;", b => b.MigrationsAssembly("Itm.Web.Api"));
            //optionsBuilder.UseSqlServer(ItmConfigurations.IdentityServerConnectionString, b => b.MigrationsAssembly("Itm.Web.Api"));
        }
    }
}
