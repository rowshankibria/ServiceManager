using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using LoanManager.ApplicationService.Models;
using LoanManager.Data;
using LoanManager.Data.Models;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using LoanManager.Shared;
using DevExtreme.AspNet.Data.ResponseModel;
using DevExtreme.AspNet.Data;

namespace LoanManager.ApplicationService
{
    public class RoleService : BaseService, IRoleService
    {
        private readonly IRepository<SystemRole> roleManager;
        private readonly IRepository<SystemUser> userManager;
        private readonly IRepository<SystemModule> moduleRepository;
        private readonly IRepository<SystemRoleRight> applicationRoleRightRepository;
        private readonly IRepository<SystemEntityRight> entityRightRepository;
        private readonly IRepository<SystemEntity> entityRepository;
        private readonly IRepository<SystemUserRole> userRoleRepository;

        public RoleService(ILogger<RoleService> logger
            , IMapper mapper
            , IRepository<SystemRole> roleManager
            , IRepository<SystemUser> userManager
            , ILoggedInUserService loggedInUserService
            , IRepository<SystemModule> moduleRepository
            , IRepository<SystemRoleRight> applicationRoleRightRepository
            , IRepository<SystemEntityRight> entityRightRepository
            , IRepository<SystemEntity> entityRepository
            , IRepository<SystemUserRole> userRoleRepository)
            : base(logger, mapper, loggedInUserService)
        {
            this.roleManager = roleManager;
            this.userManager = userManager;
            this.moduleRepository = moduleRepository;
            this.applicationRoleRightRepository = applicationRoleRightRepository;
            this.entityRightRepository = entityRightRepository;
            this.entityRepository = entityRepository;
            this.userRoleRepository = userRoleRepository;
        }

        public async Task<LoadResult> GetRolesAsync(DataSourceLoadOptionsBase options)
        {
            //options.Select = new[] { "Id", "Name", "Description", "IsActive", "BusinessProfile.CompanyName" };
            //var result = await Task.Run(() => DataSourceLoader.Load(roleManager.Roles, options));
            //return result;

            var query = from c in this.roleManager.GetAll()
                        join parent in this.roleManager.GetAll() on c.ParentRoleId equals parent.Id                        
                        select new
                        {
                            c.Id,
                            c.Name,
                            ParentRole = parent.Name,
                            c.Description,
                            c.IsActive
                        };

            return await Task.Run(() => DataSourceLoader.Load(query, options));
        }

        public async Task<RoleModel> GetRoleAsync(long id)
        {
            if (id == 0)
            {
                return new RoleModel();
            }

            SystemRole applicationRole = await roleManager.GetAll().Where(t=>t.Id == id).Include(x => x.SystemRoleRights).FirstOrDefaultAsync();

            if (applicationRole == null)
            {
                throw new ItmNotFoundException("Role not found");
            }

            RoleModel model = Mapper.Map<RoleModel>(applicationRole);
            model.RoleRights = applicationRole.SystemRoleRights.Select(x => x.RightId).ToArray();

            return model;

        }

        ///// <summary>
        ///// 
        ///// </summary>
        ///// <param name="ids"></param>
        ///// <returns></returns>
        //public Task<bool> DeleteRoleAsync(long id)
        //{
        //    //if (id == null)
        //    //{
        //    //    throw new ItmArgumentMissingException("Role not found");
        //    //}
        //    //return Task.Run(() =>
        //    //{

        //    //    var role = roleManager.Where(r => r.Id == id).FirstOrDefault();
        //    //    if (role == null)
        //    //    {
        //    //        throw new ItmArgumentMissingException($"Role: {role.Name} not found");
        //    //    }

        //    //    return roleManager.DeleteAsync(role).Result.Succeeded;

        //    //});

        //    return true;
        //}

        /// <summary>
        /// 
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public Task<bool> DeleteRolesAsync(List<long> ids)
        {
            if (ids == null)
            {
                throw new ItmArgumentMissingException("Role not found");
            }
            return Task.Run(() =>
            {
                foreach (long id in ids)
                {
                    var role = roleManager.Where(r => r.Id == id).FirstOrDefault();
                    if (role == null)
                    {
                        throw new ItmArgumentMissingException($"Role: {role.Name} not found");
                    }

                    roleManager.DeleteAsync(role);
                }
                return true;
            });
        }

        public async Task<bool> IsRightExistAsync(long rightId)
        {
            return await Task.FromResult(true);
        }

        public List<SelectModel> RoleSelectItems()
        {
            long[] roleIds = LoggedInUser.RoleIds;
            List<SelectModel> objlist = roleManager.Where(x => x.IsActive && (roleIds.Contains(x.Id) || roleIds.Contains((long)x.ParentRoleId))).Select(x => new SelectModel { Id = x.Id, Name = x.Name }).ToList();
            return objlist;
        }

        public async Task<long> CreateRoleAsync(RoleModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Name))
            {
                throw new ItmArgumentMissingException("Name is missing");
            }

            SystemRole applicationRole = Mapper.Map<SystemRole>(model);
            applicationRole.CreatedByContactId = LoggedInUser.ContectId;
            applicationRole.CreatedDateTime = DateTime.Now;
            await roleManager.CreateAsync(applicationRole);

            return applicationRole.Id;
        }

        public async Task<long> UpdateRoleAsync(long id, RoleModel model)
        {
            SystemRole applicationRole = await roleManager.GetAll().Where(t => t.Id == id)
                                                                   .Include(x => x.SystemRoleRights)
                                                                   .FirstOrDefaultAsync();

            if (applicationRole == null)
            {
                throw new ItmNotFoundException("Role not found");
            }

            if (model.Name != applicationRole.Name)
            {
                if (string.IsNullOrWhiteSpace(model.Name))
                {
                    throw new ItmArgumentMissingException("Name is missing");
                }
            }

            Mapper.Map(model, applicationRole);
            applicationRole.LastUpdatedByContactId = LoggedInUser.ContectId;
            applicationRole.LastUpdatedDateTime = DateTime.Now;

            if(applicationRole.SystemRoleRights.Count > 0)
            {
                this.applicationRoleRightRepository.Delete(t=>t.RoleId == id);
            }

            applicationRole.SystemRoleRights = model.RoleRights.Select(x => new SystemRoleRight { RightId = x }).ToList();
            await roleManager.UpdateAsync(applicationRole);
            return applicationRole.Id;
        }

        public async Task<LoadResult> GetUserByRoleAsync(long roleId, DataSourceLoadOptionsBase options)
        {
            long[] userIds = this.userRoleRepository.Where(x => x.RoleId == roleId).Select(x => x.UserId).ToArray();
            //IQueryable<SystemUser> usersQuery = userManager.Where(x => userIds.Contains(x.Id));


            var query = from c in this.userManager.GetAll().Include(t => t.Contact)
                        where userIds.Contains(c.Id)
                        select new
                        {
                            c.Id,
                            DisplayName = c.Contact.FirstName + " " + c.Contact.LastName,
                            c.IsActive
                        };

            return await Task.Run(() => DataSourceLoader.Load(query, options));

            //options.Select = new[] { "Id", "Contact.DisplayName", "IsActive" };
            //return await Task.Run(() => DataSourceLoader.Load(usersQuery, options));
        }

        public async Task<List<TreeModel>> GetUserPermissionsAsync(long parentRoleId)
        {
            if (parentRoleId != 0)
            {
                var query = applicationRoleRightRepository.Where(x => x.RoleId == parentRoleId).Include(x => x.Right).ThenInclude(y => y.Entity).ThenInclude(z => z.Module).ToList()
                     .Select(x => new
                     {
                         RightId = x.RightId,
                         RightName = x.Right.Name,
                         EntityId = x.Right.Entity.Id,
                         EntityName = x.Right.Entity.EntityName,
                         ModuleId = x.Right.Entity.Module.ModuleId,
                         ModuleName = x.Right.Entity.Module.ModuleName

                     });

                var modules = query.Select(x => new
                {
                    x.ModuleId,
                    x.ModuleName
                }).Distinct();

                var entities = query.Select(x => new
                {
                    x.ModuleId,
                    x.ModuleName,
                    x.EntityId,
                    x.EntityName
                }).Distinct();

                List<TreeModel> treeModels = modules.Select(x => new TreeModel
                {
                    Id = x.ModuleId,
                    Name = x.ModuleName,
                    Items = entities.Where(y => y.ModuleId == x.ModuleId).Select(z => new TreeModel
                    {
                        Id = z.EntityId,
                        Name = z.EntityName,
                        Items = query.Where(o => o.EntityId == z.EntityId).Select(k => new TreeModel
                        {
                            Id = k.RightId,
                            ParentId = z.EntityId,
                            Name = k.RightName
                        }).ToList()
                    }).ToList()
                }).ToList();

                return treeModels;
            }


            //List<TreeModel> treeModels = query.Select(x => new TreeModel
            //{
            //    Id = x.ModuleId,
            //    Name = x.ModuleName,
            //    Items = x.SystemEntities.Where(o=> o.SystemEntityRights).Select(y => new TreeModel
            //    {
            //        Id = y.Id,
            //        Name = y.EntityName,
            //        Items = y.SystemEntityRights.Where(k=>k.ApplicationRoleRights.Any(j=>j.RightId == k.Id )).Select(z => new TreeModel
            //        {
            //            Id = z.Id,
            //            ParentId = y.Id,
            //            Name = z.Name
            //        }).ToList()
            //    }).ToList()
            //}).ToList();

            //var result = await Task.Run(() => DataSourceLoader.Load(query, options));

            return null;
        }
        /// <summary>
        /// Get active role 
        /// </summary>
        /// <returns></returns>
        public async Task<List<TreeModel>> GetActiveRolesAsync()
        {
            List<SystemRole> query = roleManager.Where(x => x.IsActive).ToList();
            List<TreeModel> treeModels = query.Select(x => new TreeModel
            {
                SId = x.Id,
                Name = x.Name,
                Items = roleManager.Where(y => y.ParentRoleId == x.Id).Select(z => new TreeModel
                {
                    SId = z.Id,
                    SParentId = x.Id,
                    Name = z.Name

                }).ToList()
            }).ToList();

            return treeModels;
        }
        /// <summary>
        /// Get active role 
        /// </summary>
        /// <returns></returns>
        public List<long> GetUserSelectedRolesByUserAsync()
        {
            //return roleManager.Where(x => LoggedInUser.RoleIds.Contains(x.Id)).Select(t => t.Id).ToList();
            return new List<long>();
        }

        /// <summary>
        /// get user permission by role id list
        /// </summary>
        /// <param name="roleIds"></param>
        /// <returns></returns>
        public async Task<List<TreeModel>> GetPermissionsByRoleListAsync(List<long> roleIds)
        {
            List<long> rightIds = this.applicationRoleRightRepository.Where(t => roleIds.Contains(t.RoleId)).Select(t => t.RightId).Distinct().ToList();
            List<long> entityIds = this.entityRightRepository.Where(t => rightIds.Contains(t.Id)).Select(t => t.EntityId).Distinct().ToList();
            List<long> moduleIds = this.entityRepository.Where(t => entityIds.Contains(t.Id)).Select(t => t.ModuleId).Distinct().ToList();
            List<SystemModule> query = moduleRepository.Where(x => x.IsActive).Include(y => y.SystemEntities).ThenInclude(z => z.SystemEntityRights).ToList();

            List<TreeModel> treeModels = query.Where(t => moduleIds.Contains(t.ModuleId)).Select(x => new TreeModel
            {
                Id = x.ModuleId,
                Name = x.ModuleName,
                Items = x.SystemEntities.Where(t => entityIds.Contains(t.Id)).Select(y => new TreeModel
                {
                    Id = y.Id,
                    Name = y.EntityName,
                    Items = y.SystemEntityRights.Where(t => rightIds.Contains(t.Id)).Select(z => new TreeModel
                    {
                        Id = z.Id,
                        ParentId = y.Id,
                        Name = z.Name
                    }).ToList()
                }).ToList()
            }).ToList();



            return treeModels;
        }

        /// <summary>
        /// get user permission by role id list
        /// </summary>
        /// <param name="roleIds"></param>
        /// <returns></returns>
        public async Task<List<TreeModel>> GetRightByRoleListAsync(long id)
        {
            SystemUser user = userManager.Where(t => t.Id == id).FirstOrDefault();
            if (user == null)
            {
                return new List<TreeModel>();
            }

            var roleIds = user.SystemUserRoles.Select(t => t.RoleId).ToList();
            //var roleIds = roleObj.ToList();
            List<long> rightIds = this.applicationRoleRightRepository.Where(t => roleIds.Contains(t.RoleId)).Select(t => t.RightId).Distinct().ToList();
            List<long> entityIds = this.entityRightRepository.Where(t => rightIds.Contains(t.Id)).Select(t => t.EntityId).Distinct().ToList();
            List<long> moduleIds = this.entityRepository.Where(t => entityIds.Contains(t.Id)).Select(t => t.ModuleId).Distinct().ToList();
            List<SystemModule> query = moduleRepository.Where(x => x.IsActive).Include(y => y.SystemEntities).ThenInclude(z => z.SystemEntityRights).ToList();

            List<TreeModel> treeModels = query.Where(t => moduleIds.Contains(t.ModuleId)).Select(x => new TreeModel
            {
                Id = x.ModuleId,
                Name = x.ModuleName,
                Items = x.SystemEntities.Where(t => entityIds.Contains(t.Id)).Select(y => new TreeModel
                {
                    Id = y.Id,
                    Name = y.EntityName,
                    Items = y.SystemEntityRights.Where(t => rightIds.Contains(t.Id)).Select(z => new TreeModel
                    {
                        Id = z.Id,
                        ParentId = y.Id,
                        Name = z.Name
                    }).ToList()
                }).ToList()
            }).ToList();



            return treeModels;
        }

        public async Task<bool> DeleteRoleAsync(long id)
        {

            if (id == 0)
            {
                throw new ItmArgumentMissingException("Role not found");
            }

            var userRoleObj = this.userRoleRepository.Where(t => t.RoleId == id).FirstOrDefault();
            if(userRoleObj != null)
            {
                this.userRoleRepository.Delete(t => t.RoleId == id);
            }

            var roleRightObj = this.applicationRoleRightRepository.Where(t => t.RoleId == id).FirstOrDefault();
            if(roleRightObj != null)
            {
                this.applicationRoleRightRepository.Delete(t => t.RoleId == id);
            }


                SystemRole role = roleManager.Where(r => r.Id == id).FirstOrDefault();
                if (role == null)
                {
                    throw new ItmArgumentMissingException($"Role: {role.Name} not found");
                }

              return roleManager.Delete(role) > 0;
        }       
    }
}
