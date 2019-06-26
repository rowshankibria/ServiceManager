using AutoMapper;
using LoanManager.ApplicationService.Models;
using LoanManager.Data;
using LoanManager.Data.Models;
using LoanManager.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
    public class ApplicationMenuService : BaseService, IApplicationMenuService
    {
        private readonly IRepository<ApplicationMenu> applicationMenuRepository;
        private readonly IRepository<Contact> contactRepository;
        private readonly IRepository<Photo> photoRepository;
        private readonly IRepository<SystemRoleRight> applicationRoleRightRepository;
        private readonly IApplicationCacheService applicationCacheService;
        public ApplicationMenuService(
            ILogger<ApplicationMenuService> logger
            , IMapper mapper
            , IRepository<ApplicationMenu> applicationMenuRepository
            , IRepository<Contact> contactRepository
            , IRepository<Photo> photoRepository
            , IRepository<SystemRoleRight> applicationRoleRightRepository
            , ILoggedInUserService loggedInUserService
            , IApplicationCacheService applicationCacheService) : base(logger, mapper, loggedInUserService)
        {
            this.applicationMenuRepository = applicationMenuRepository;
            this.applicationRoleRightRepository = applicationRoleRightRepository;
            this.applicationCacheService = applicationCacheService;
            this.contactRepository = contactRepository;
            this.photoRepository = photoRepository;
        }


        public async Task<List<ApplicationMenuModel>> GetApplicationMenuAsync()
        {
            List<ApplicationMenuModel> results = await Task.Run(() => GetApplicationMenu());
            return results;
        }

        public async Task<ApplicationHeaderModel> GetApplicationHeaderAsync()
        {
            return await Task.Run(() =>
            {



                ApplicationHeaderModel applicationHeader = new ApplicationHeaderModel();
                applicationHeader.Gender = this.LoggedInUser.Gender;
                applicationHeader.ImageSource = this.LoggedInUser.ImageSource;
                applicationHeader.DisplayName = $"{this.LoggedInUser.FirstName} {this.LoggedInUser.LastName}";

                Contact objCon = new Contact();
                objCon = this.contactRepository.Where(t => t.Id == this.LoggedInUser.ContectId)
                                                .Include(t => t.Photo)
                                                .FirstOrDefault();

                if (objCon != null)
                {
                    applicationHeader.PhotoThumb = objCon.Photo != null ? objCon.Photo.PhotoThumb : null;
                }


                return applicationHeader;
            });
        }

        private List<ApplicationMenuModel> GetApplicationMenu()
        {
            //return new List<ApplicationMenuModel>();
            var menu = this.applicationCacheService.GetApplicationMenu();
            var roleRights = this.applicationCacheService.GetApplicationRoleRight();
            var userRoles = this.LoggedInUser.RoleIds;

            if (LoggedInUser.IsSystemAdmin)
            {
                var appMenuSuperAdmin = menu.Where(m => m.ParentId == null)
                       .Select(s => new ApplicationMenu
                       {
                           Caption = s.Caption,
                           EntityId = s.EntityId,
                           EntityRightId = s.EntityRightId,
                           Id = s.Id,
                           Name = s.Name,
                           NavigateUrl = s.NavigateUrl,
                           ImageSource = s.ImageSource,
                           InverseParent = GetChildren(menu.Where(m => m.ParentId == s.Id), s.Id)
                       });

                return Mapper.Map<List<ApplicationMenuModel>>(appMenuSuperAdmin);                
            }

            var userMenu = (from m in menu
                            join r in roleRights.Where(r => userRoles.Contains(r.RoleId)).Distinct() on m.EntityRightId equals r.RightId into rr
                            from r in rr.DefaultIfEmpty()
                            orderby m.RowNo
                            where m.ParentId == null || r != null
                            select m).Distinct();


            var appMenu = userMenu.Where(m => m.ParentId == null)
                        .Select(s => new ApplicationMenu
                        {
                            Caption = s.Caption,
                            EntityId = s.EntityId,
                            EntityRightId = s.EntityRightId,
                            Id = s.Id,
                            Name = s.Name,
                            NavigateUrl = s.NavigateUrl,
                            ImageSource = s.ImageSource,
                            InverseParent = GetChildren(userMenu.Where(m => m.ParentId == s.Id), s.Id)
                        });

            var results = Mapper.Map<List<ApplicationMenuModel>>(appMenu);

            results.RemoveAll(t => t.InverseParent.Count <= 0);

            return results;
        }

        private List<ApplicationMenu> GetChildren(IEnumerable<ApplicationMenu> userMenu, long? parentId)
        {
            var child = userMenu
                    .Where(c => c.ParentId == parentId)
                    .Select(s => new ApplicationMenu
                    {
                        Caption = s.Caption,
                        EntityId = s.EntityId,
                        EntityRightId = s.EntityRightId,
                        Id = s.Id,
                        Name = s.Name,
                        NavigateUrl = s.NavigateUrl,
                        ImageSource = s.ImageSource,
                        InverseParent = GetChildren(userMenu.Where(m => m.ParentId == s.Id), s.Id)
                    })
                    .ToList();

            return child;
        }

    }
}
