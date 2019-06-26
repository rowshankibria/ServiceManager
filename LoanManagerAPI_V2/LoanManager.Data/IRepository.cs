using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace LoanManager.Data
{
    public interface IRepository<TEntity> where TEntity : class
    {
        IQueryable<TEntity> GetAll();
        Task<ICollection<TEntity>> GetAllAsync();
        IQueryable<TEntity> AsQueryable();
        IQueryable<TEntity> Where(Expression<Func<TEntity, bool>> predicate);
        Task<ICollection<TEntity>> WhereAsync(Expression<Func<TEntity, bool>> predicate);
        //TEntity FindOne(Expression<Func<TEntity, bool>> predicate, Func<IQueryable<TEntity>, IQueryable<TEntity>> func = null);
        Task<TEntity> FindOneAsync(Expression<Func<TEntity, bool>> predicate);
        //TEntity FindOne(Expression<Func<TEntity, bool>> predicate, List<string> includeProperties);
        TEntity FindOne(Expression<Func<TEntity, bool>> predicate);
        TEntity FindOne(Expression<Func<TEntity, bool>> predicate, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null);
        void Include<TProperty>(Expression<Func<TEntity, TProperty>> navigationPropertyPath);
        Task<TEntity> FindOneAsync(Expression<Func<TEntity, bool>> predicate, List<string> includeProperties);
        bool Exists(Expression<Func<TEntity, bool>> predicate);
        Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate);
        int Count();
        Task<int> CountAsync();
        int Count(Expression<Func<TEntity, bool>> predicate);
        Task<int> CountAsync(Expression<Func<TEntity, bool>> predicate);
        TEntity Create(TEntity entity);
        Task<TEntity> CreateAsync(TEntity entity);
        void CreateRange(IEnumerable<TEntity> entities);
        Task<int> CreateRangeAsync(IEnumerable<TEntity> entities);
        TEntity Update(TEntity entity);
        int Update(List<TEntity> entities);
        Task<int> UpdateAsync(List<TEntity> entities);
        Task<TEntity> UpdateAsync(TEntity entity);
        int Delete(TEntity entity);
        Task<int> DeleteAsync(TEntity entity);
        int Delete(Expression<Func<TEntity, bool>> predicate);
        Task<int> DeleteAsync(Expression<Func<TEntity, bool>> predicate);
        LoadResult GetDevExpressList(DataSourceLoadOptionsBase options);
        Task<LoadResult> GetDevExpressListAsync(DataSourceLoadOptionsBase options);
        LoadResult GetDevExpressList(DataSourceLoadOptionsBase options, Expression<Func<TEntity, bool>> predicate);
        Task<LoadResult> GetDevExpressListAsync(DataSourceLoadOptionsBase options, Expression<Func<TEntity, bool>> predicate);
        void Attach(TEntity entity);
        void Attach(List<TEntity> entities);
        void Remove(TEntity entity);
        void Remove(List<TEntity> entities);
        int SaveChanges();
        Task<int> SaveChangesAsync();
    }
}
