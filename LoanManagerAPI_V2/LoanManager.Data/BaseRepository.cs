using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LoanManager.Data.Models;
using Microsoft.AspNetCore.Http;
using LoanManager.Shared;
using DevExtreme.AspNet.Data.ResponseModel;
using DevExtreme.AspNet.Data;

namespace LoanManager.Data
{
    public abstract class BaseRepository<TDbContext, TEntity> : IRepository<TEntity> , ILoggedInUserService
        where TEntity : class
        where TDbContext : DbContext
    {
        protected readonly TDbContext context;
        protected readonly DbSet<TEntity> dbSet;
        private readonly ILoggedInUserService loggedInUserService;
        public ILoggedInUser LoggedInUser => loggedInUserService.LoggedInUser;

        protected BaseRepository(TDbContext context, ILoggedInUserService loggedInUserService)
        {            
            this.context = context ?? throw new ItmArgumentMissingException(nameof(context));
            //this.context.ChangeTracker.LazyLoadingEnabled = false;
            //this.context.ChangeTracker.AutoDetectChangesEnabled = false;
            //this.context.Configuration.AutoDetectChangesEnabled = false;
            //this.context.Configuration.ValidateOnSaveEnabled = true;
            //this.context.Configuration.LazyLoadingEnabled = false;
            //this.context.Configuration.ProxyCreationEnabled = false;
            //this.context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.TrackAll;
            dbSet = this.context.Set<TEntity>();
            this.loggedInUserService = loggedInUserService;
        }

        public void Include<TProperty>(Expression<Func<TEntity, TProperty>> navigationPropertyPath)
        {
            dbSet.Include(navigationPropertyPath);
        }

        public virtual IQueryable<TEntity> GetAll()
        {
            return dbSet.AsQueryable();
        }

        public virtual async Task<ICollection<TEntity>> GetAllAsync()
        {

            return await context.Set<TEntity>().ToListAsync();
        }

        public virtual IQueryable<TEntity> AsQueryable()
        {
            return dbSet.AsQueryable();
        }

        public IQueryable<TEntity> Where(Expression<Func<TEntity, bool>> predicate)
        {
            return dbSet.Where(predicate);
        }

        public async Task<ICollection<TEntity>> WhereAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await context.Set<TEntity>().Where(predicate).ToListAsync();
        }

        public TEntity FindOne(Expression<Func<TEntity, bool>> predicate)
        {
            return dbSet.FirstOrDefault(predicate);
        }
        public virtual async Task<TEntity> FindOneAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await dbSet.FirstOrDefaultAsync(predicate);
        }


        public virtual TEntity FindOne(Expression<Func<TEntity, bool>> predicate, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null)
        {

            IQueryable<TEntity> query = dbSet;
            query = include(query);

            return query.FirstOrDefault(predicate);
        }

        public virtual async Task<TEntity> FindOneAsync(Expression<Func<TEntity, bool>> predicate, List<string> includeProperties)
        {
            IQueryable<TEntity> query = dbSet.Where(predicate);

            if (includeProperties != null)
            {
                foreach (string name in includeProperties)
                {
                    query = query.Include(name);
                }
            }

            return await query.FirstOrDefaultAsync();
        }

        public virtual bool Exists(Expression<Func<TEntity, bool>> predicate)
        {
            return dbSet.Any(predicate);
        }

        public virtual async Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await dbSet.AnyAsync(predicate);
        }

        public virtual int Count()
        {
            return dbSet.Count();
        }

        public virtual async Task<int> CountAsync()
        {
            return await dbSet.CountAsync();
        }

        public virtual int Count(Expression<Func<TEntity, bool>> predicate)
        {
            return dbSet.Count(predicate);
        }

        public virtual async Task<int> CountAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await dbSet.CountAsync(predicate);
        }

        public virtual TEntity Create(TEntity entity)
        {
            dbSet.Add(entity);
            this.SaveChanges();
            return entity;
        }

        public virtual void Attach(TEntity entity)
        {
            if (entity == null)
            {
                return;
            }

            EntityEntry<TEntity> entry = context.Entry(entity);
            if (entry == null)
            {
                dbSet.Add(entity);
            }
            else
            {
                dbSet.Attach(entity);
                entry.State = EntityState.Modified;
            }
        }

        public virtual void Attach(List<TEntity> entities) {

            if (entities == null)
            {
                return;
            }
            foreach (TEntity entity in entities) {
                EntityEntry<TEntity> entry = context.Entry(entity);
                if (entry == null)
                {
                    dbSet.Add(entity);
                }
                else
                {
                    dbSet.Attach(entity);
                    entry.State = EntityState.Modified;
                }
            }
        }

        public virtual void Remove(TEntity entity)
        {
            if (entity == null)
            {
                return;
            }

            EntityEntry<TEntity> entry = context.Entry(entity);
            if (entry != null)
            {
                dbSet.Remove(entity);
                entry.State = EntityState.Deleted;
            }
        }

        public virtual void Remove(List<TEntity> entities)
        {

            if (entities == null)
            {
                return;
            }
            foreach (TEntity entity in entities)
            {
                EntityEntry<TEntity> entry = context.Entry(entity);
                if (entry != null) 
                {
                    dbSet.Remove(entity);
                    entry.State = EntityState.Deleted;
                }
            }
        }

        public virtual async Task<TEntity> CreateAsync(TEntity entity)
        {
            dbSet.Add(entity);
            await this.SaveChangesAsync();
            return entity;
        }

        public virtual void CreateRange(IEnumerable<TEntity> entities)
        {
            dbSet.AddRange(entities);
            this.SaveChanges();
        }

        public virtual async Task<int> CreateRangeAsync(IEnumerable<TEntity> entities)
        {
            dbSet.AddRange(entities);
            return await this.SaveChangesAsync();
        }

        public virtual TEntity Update(TEntity entity)
        {
            if (entity == null)
                return null;

            EntityEntry<TEntity> entry = context.Entry(entity);
            dbSet.Attach(entity);
            entry.State = EntityState.Modified;
            this.SaveChanges();

            return entity;
        }

        public virtual async Task<TEntity> UpdateAsync(TEntity entity)
        {
            if (entity == null)
                return null;

            EntityEntry<TEntity> entry = context.Entry(entity);
            dbSet.Attach(entity);
            entry.State = EntityState.Modified;
            await this.SaveChangesAsync();

            return entity;
        }
 

        public virtual int Update(List<TEntity> entities)
        {
            foreach (TEntity entity in entities)
            {
                EntityEntry<TEntity> entry = context.Entry(entity);

                dbSet.Attach(entity);
                entry.State = EntityState.Modified;
            }
            return this.SaveChanges();
        }

        public virtual async Task<int> UpdateAsync(List<TEntity> entities)
        {
            foreach (TEntity entity in entities)
            {
                EntityEntry<TEntity> entry = context.Entry(entity);

                dbSet.Update(entity);
            }
            return await this.SaveChangesAsync();
        }
 

        public virtual int Delete(TEntity entity)
        {
            dbSet.Remove(entity);
            return this.SaveChanges();
        }

        public virtual async Task<int> DeleteAsync(TEntity entity)
        {
            dbSet.Remove(entity);
            return await this.SaveChangesAsync();
        }

        public virtual int Delete(Expression<Func<TEntity, bool>> predicate)
        {
            IQueryable<TEntity> objects = Where(predicate);
            dbSet.RemoveRange(objects);
            return this.SaveChanges();
        }

        public virtual async Task<int> DeleteAsync(Expression<Func<TEntity, bool>> predicate)
        {
            IQueryable<TEntity> objects = Where(predicate);
            dbSet.RemoveRange(objects);
            return await this.SaveChangesAsync();
        }

        public virtual LoadResult GetDevExpressList(DataSourceLoadOptionsBase options)
        {
            return DataSourceLoader.Load(dbSet.AsEnumerable(), options);
        }

        public virtual async Task<LoadResult> GetDevExpressListAsync(DataSourceLoadOptionsBase options)
        {
            return await Task.Run(() => DataSourceLoader.Load(dbSet.AsEnumerable(), options));
        }

        public virtual LoadResult GetDevExpressList(DataSourceLoadOptionsBase options, Expression<Func<TEntity, bool>> predicate)
        {
            return DataSourceLoader.Load(dbSet.Where(predicate).AsEnumerable(), options);
        }

        public virtual async Task<LoadResult> GetDevExpressListAsync(DataSourceLoadOptionsBase options, Expression<Func<TEntity, bool>> predicate)
        {
            return await Task.Run(() => DataSourceLoader.Load(dbSet.Where(predicate).AsEnumerable(), options));
        }

        public virtual int SaveChanges()
        {
            OnBeforeSaving();
            return context.SaveChanges();
        }

        public virtual async Task<int> SaveChangesAsync()
        {
            OnBeforeSaving();
            return await context.SaveChangesAsync();
        }

        private void OnBeforeSaving()
        {
            long contactId = LoggedInUser.ContectId;
            foreach (var trackableEntity in this.context.ChangeTracker.Entries<ITrackable>()
                                            .Where(x => x.State == EntityState.Added || x.State == EntityState.Modified))
            {
                if (trackableEntity.State == EntityState.Added ||
                    trackableEntity.State == EntityState.Modified)
                {
                    // modify updated date and updated by column for adds of updates.
                    trackableEntity.Entity.LastUpdatedDateTime = DateTime.Now;
                    trackableEntity.Entity.LastUpdatedByContactId = contactId;

                    // pupulate created date and created by columns for newly added record.
                    if (trackableEntity.State == EntityState.Added)
                    {
                        trackableEntity.Entity.CreatedDateTime = DateTime.Now;
                        trackableEntity.Entity.CreatedByContactId = contactId;
                    }
                    else
                    {
                        // we also want to make sure that code is not inadvertly modifying created date and created by columns 
                        trackableEntity.Property(p => p.CreatedDateTime).IsModified = false;
                        trackableEntity.Property(p => p.CreatedByContactId).IsModified = false;
                    }
                }
            }
        }

        /// <summary>
        /// TODO Stored Procedure
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public virtual LoadResult GetDevExpressStoredProcedure(DataSourceLoadOptionsBase options, string procedureName, params object[] args)
        {
            SqlParameter parameter = new SqlParameter("BusinessProfileId", typeof(Guid)) { Value = new Guid("03E2DF64-A9DB-8B6B-CAF9-B7D7D92D145A") };
            Guid businessProfile = new Guid("03E2DF64-A9DB-8B6B-CAF9-B7D7D92D145A");

            return null;
        }
    }
}
