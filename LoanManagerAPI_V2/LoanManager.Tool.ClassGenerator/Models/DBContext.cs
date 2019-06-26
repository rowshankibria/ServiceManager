using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Itm.Tool.ClassGenerator.Models
{
    public partial class DBContext : DbContext
    {
        public DBContext()
        {
        }

        public DBContext(DbContextOptions<DBContext> options)
            : base(options)
        {
        }

        
        public virtual DbSet<SystemEntity> SystemEntitys { get; set; }
        public virtual DbSet<SystemEntityRight> SystemEntityRights { get; set; }

        public virtual DbSet<EntityType> EntityTypes { get; set; }
        public virtual DbSet<CustomCategoryMapType> CustomCategoryMapTypes { get; set; }
        public virtual DbSet<CustomCategoryMapTypeOption> CustomCategoryMapTypeOptions { get; set; }
        public virtual DbSet<CustomCategory> CustomCategories { get; set; }
        public virtual DbSet<CustomCategoryType> CustomCategoryTypes { get; set; }

        public virtual DbSet<BusinessCategoryMapType> BusinessCategoryMapTypes { get; set; }        
        public virtual DbSet<BusinessCategoryType> BusinessCategoryTypes { get; set; }
        public virtual DbSet<BusinessCategory> BusinessCategories { get; set; }
        
        

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=localhost;Database=ServiceManage_v1.0;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
           

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

                
            });

            modelBuilder.Entity<SystemEntityRight>(entity =>
            {
                entity.ToTable("SystemEntityRight", "security");

                entity.HasIndex(e => new { e.RightKey, e.EntityId })
                    .HasName("UK_SystemEntityRight")
                    .IsUnique();

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
                    .WithMany(p => p.SystemEntityRight)
                    .HasForeignKey(d => d.EntityId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<EntityType>(builder =>
            {
                builder.ToTable("EntityType", "core");

                builder.Property(e => e.Id).ValueGeneratedNever();

                builder.Property(e => e.Description)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                builder.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<CustomCategoryMapType>(builder =>
            {
                builder.ToTable("CustomCategoryMapType", "core");

                builder.HasIndex(e => e.Name)
                    .HasName("UK_CustomCategoryMapType")
                    .IsUnique();

                builder.Property(e => e.Id).ValueGeneratedNever();

                builder.Property(e => e.Description)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                builder.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<CustomCategoryMapTypeOption>(builder =>
            {
                builder.ToTable("CustomCategoryMapTypeOption", "core");

                builder.Property(e => e.Id).ValueGeneratedNever();

                builder.Property(e => e.Description)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                builder.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                builder.HasOne(d => d.CustomCategoryMapType)
                    .WithMany(p => p.CustomCategoryMapTypeOptions)
                    .HasForeignKey(d => d.CustomCategoryMapTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<CustomCategory>(builder =>
            {
                builder.ToTable("CustomCategory", "core");

                builder.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                builder.Property(e => e.Code)
                    .HasMaxLength(50)
                    .IsUnicode(false);             

            });

            modelBuilder.Entity<CustomCategoryType>(builder =>
            {
                builder.ToTable("CustomCategoryType", "core");

                builder.Property(e => e.Id).ValueGeneratedNever();

                builder.Property(e => e.HelpText).IsUnicode(false);

                builder.HasIndex(e => e.RoutingKey)
                   .HasName("UK_CustomCategoryType_RoutingKey")
                   .IsUnique();

                builder.Property(e => e.ImageSource)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                builder.Property(e => e.ModuleName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                builder.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

            });

            modelBuilder.Entity<BusinessCategory>(builder =>
            {
                builder.ToTable("BusinessCategory", "core");

                builder.Property(e => e.Description)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                builder.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                builder.HasOne(d => d.BusinessCategoryType)
                    .WithMany(p => p.BusinessCategories)
                    .HasForeignKey(d => d.BusinessCategoryTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

            });

            modelBuilder.Entity<BusinessCategoryType>(builder =>
            {
                builder.ToTable("BusinessCategoryType", "core");

                builder.Property(e => e.Id).ValueGeneratedNever();

                builder.HasIndex(e => e.Name)
                    .HasName("UK_BusinessCategoryType_Name")
                    .IsUnique();

                builder.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);



            });


            modelBuilder.Entity<BusinessCategoryMapType>(builder =>
            {
                builder.ToTable("BusinessCategoryMapType", "core");

                builder.Property(e => e.Id).ValueGeneratedNever();

                builder.Property(e => e.Description)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                builder.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                builder.Property(e => e.Value)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                builder.HasOne(d => d.BusinessCategory)
                    .WithMany(p => p.BusinessCategoryMapTypes)
                    .HasForeignKey(d => d.BusinessCategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

            });


            

        }
    }
}
