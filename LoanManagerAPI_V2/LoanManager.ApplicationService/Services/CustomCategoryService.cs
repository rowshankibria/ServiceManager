using AutoMapper;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
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
    public class CustomCategoryService : BaseService, ICustomCategoryService
    {
        private readonly IRepository<CustomCategory> customCategoryRepository;
        private readonly IRepository<CustomCategoryType> customCategoryTypeRepository;
        private readonly IRepository<EntityType> entityTypeRepository;

        public CustomCategoryService(IRepository<CustomCategoryType> customCategoryTypeRepository, IRepository<CustomCategory> typeNCatRepository, IRepository<EntityType> entityTypeRepository,
            ILogger<CustomCategoryService> logger, IMapper mapper, ILoggedInUserService loggedInUserService) : base(logger, mapper, loggedInUserService)
        {
            this.customCategoryTypeRepository = customCategoryTypeRepository;
            this.customCategoryRepository = typeNCatRepository;
            this.entityTypeRepository = entityTypeRepository;
        }


        public async Task<List<CustomCategoryModuleModel>> GetCustomCategoryModuleListAsync()
        {
            var categoryTypes = customCategoryTypeRepository.Where(t=>!t.IsInternal);

            List<CustomCategoryTypeModel> categoryTypemodels = Mapper.Map<List<CustomCategoryTypeModel>>(categoryTypes);

            return categoryTypemodels.OrderBy(m => m.RowNo).GroupBy(m => m.ModuleName).Select(m => new CustomCategoryModuleModel
            {
                Name = m.Key,
                CustomCategoryTypes = m.Select(c => new CustomCategoryTypeModel
                {
                    Name = c.Name,
                    RoutingKey = c.RoutingKey,
                    HelpText = c.HelpText,
                    CustomCategoryMapTypeId = c.CustomCategoryMapTypeId,
                    Id = c.Id,
                    CustomCategories = c.CustomCategories,
                    ImageSource = c.ImageSource,
                    ModuleName = c.ModuleName,
                    RightId = c.RightId,
                    RowNo = c.RowNo
                }).ToList()
            }).ToList();
        }
        public async Task<List<SelectModel>> GetCustomCategoryListByTypeIdAsync(int categoryTypeId)
        {   
            return await Task.Run(() => this.customCategoryRepository
                                            .Where(t => t.CustomCategoryTypeId == categoryTypeId && t.IsActive)
                                            .OrderBy(t => t.DisplayOrder)
                .Select(t => new SelectModel
                {
                    Id = t.Id,
                    Name = t.Name,                    
                    IsDefault = t.IsDefault
                }).ToList());
        }
        public async Task<List<SelectModel>> GetCustomCategoryListByTypeIdAsync(int categoryTypeId, int businessProfileId)
        {
            return await Task.Run(() => this.customCategoryRepository
                                            .Where(t => t.CustomCategoryTypeId == categoryTypeId && t.IsActive)
                                            .OrderBy(t => t.DisplayOrder)
                .Select(t => new SelectModel
                {
                    Id = t.Id,
                    Name = t.Name,                   
                    IsDefault = t.IsDefault
                }).ToList());
        }
        public async Task<List<CustomCategoryTypeModel>> GetCustomCategoryTypeListAsync(List<long> ids)
        {
            long businessProfileId = this.LoggedInUser.BusinessProfileId;
            bool isDefaultBusinessProfileUser = this.LoggedInUser.IsDefaultBusinessProfile;
            return await Task.Run(() => this.customCategoryTypeRepository
                .Where(x => ids.Contains(x.Id))
                .Include(t => t.CustomCategories)
                .Select(x => new CustomCategoryTypeModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    CustomCategories = x.CustomCategories
                        .Where(c => c.IsActive)
                        .OrderBy(c => c.DisplayOrder)
                        .Select(c => new CustomCategoryModel
                        {
                            Id = c.Id,
                            Name = c.Name,                            
                            IsDefault = c.IsDefault
                        }).ToList()
                }).ToList());
        }
        public async Task<List<SelectModel>> GetEntityTypeListAsync()
        {
            return await Task.Run(() => this.entityTypeRepository.Where(t => !t.IsInternal).OrderBy(t => t.Name)
              .Select(t => new SelectModel
              {
                  Id = t.Id,
                  Name = t.Name
              }).ToList());
        }


        public async Task<LoadResult> GetCustomCategoryListByRoutingKeyAsync(string routingKey, DataSourceLoadOptionsBase options)
        {
            //options.Select = new[] { "Id", "Name", "Code", "BusinessProfile.CompanyName", "Desciption",
            //    "CustomCategoryMapTypeOption.Name", "DisplayOrder", "IsDefault", "DisplayOrder", "IsActive",
            //    "CreatedByContact.DisplayName", "CreatedDateTime" };
            //options.Select = new[] { "Id", "Name", "Code", "Desciption", "DisplayOrder", "IsDefault", "DisplayOrder", "IsActive",  "CreatedDateTime" };

            var query = this.customCategoryRepository.Where(x => x.CustomCategoryType != null && x.CustomCategoryType.RoutingKey == routingKey)
                .Include(c => c.CustomCategoryMapTypeOption)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Code,                    
                    c.Desciption,
                    MapTypeOptionName = c.CustomCategoryMapTypeOption.Name,
                    c.DisplayOrder,
                    c.IsDefault,
                    c.IsActive                   
                });

            //return await customCategoryRepository.GetDevExpressListAsync(options, x => x.CustomCategoryType != null && x.CustomCategoryType.RoutingKey == routingKey);

            return await Task.Run(() => DataSourceLoader.Load(query, options));

            //return await customCategoryRepository.GetDevExpressListAsync(options);
        }

        public async Task<List<SelectModel>> GetMapTypeSelectListAsync(string routingKey)
        {
            var catType = await Task.Run(() => customCategoryTypeRepository.Where(t => t.RoutingKey == routingKey)
                 .Include(m => m.CustomCategoryMapType).ThenInclude(m => m.CustomCategoryMapTypeOptions).FirstOrDefault());
            if (catType?.CustomCategoryMapTypeId > 0)
            {
                List<SelectModel> models = catType.CustomCategoryMapType.CustomCategoryMapTypeOptions.Select(x => new SelectModel
                {
                    Id = x.Id,
                    Name = x.Name,
                }).ToList();

                return models;
            }
            return new List<SelectModel>();
        }

        #region Insert/Update/Delete Methods

        public async Task<CustomCategoryModel> GetCustomCategoryByIdAsync(long id)
        {
            if (id == 0)
            {
                return new CustomCategoryModel();
            }

            CustomCategory customCategory = await customCategoryRepository.FindOneAsync(x => x.Id == id);

            if (customCategory == null)
            {
                throw new ItmNotFoundException("Custom Category not found");
            }

            return Mapper.Map<CustomCategoryModel>(customCategory);
        }
        public async Task<CustomCategoryTypeModel> GetCustomCategoryTypeByRoutingKeyAsync(string routingKey)
        {
            var type = await customCategoryTypeRepository.Where(t => t.RoutingKey == routingKey).FirstOrDefaultAsync();

            if (type == null)
            {
                throw new ItmNotFoundException($"{routingKey} Category not found.");
            }

            return Mapper.Map<CustomCategoryTypeModel>(type);
        }
        public async Task<long> SaveCustomCategoryAsync(long id, CustomCategoryModel model)
        {
            if (model == null)
            {
                throw new ItmArgumentMissingException("Invalid category data");
            }

            CustomCategory customCategory = new CustomCategory();

            var customCategoryType = customCategoryTypeRepository.Where(x => x.Id == model.CustomCategoryTypeId).Include(x => x.CustomCategories).FirstOrDefault();
            if (customCategoryType.CustomCategoryMapTypeId > 0 && customCategoryType.IsMapTypeMappingUnique)
            {
                if (id > 0)
                {
                    if (customCategoryRepository.Where(x => 
                        x.CustomCategoryMapTypeOptionId == model.CustomCategoryMapTypeOptionId
                        && x.Id != id).Any())
                    {
                        throw new ItmInvalidDataException("Mapping multiple types and categories with same type is not allowed");
                    }
                }
                else
                {
                    if (customCategoryRepository.Where(x => x.CustomCategoryMapTypeOptionId == model.CustomCategoryMapTypeOptionId).Any())
                    {
                        throw new ItmInvalidDataException("Mapping multiple types and categories with same type is not allowed");
                    }
                }

            }

            if (id > 0)
            {
                customCategory = await customCategoryRepository.FindOneAsync(x => x.Id == id);

                if (customCategory == null)
                {
                    throw new ItmNotFoundException("Category not found for edit");
                }
            }
            else
            {

                if (customCategoryType.CustomCategories.Any())
                {
                    model.DisplayOrder = customCategoryType.CustomCategories.Max(x => x.DisplayOrder) + 1;
                }
                else
                {
                    model.DisplayOrder = 1;
                }
            }

            Mapper.Map(model, customCategory);

            if (model.IsDefault)
            {
                customCategoryRepository.Attach(customCategoryRepository
                                                .Where(x => x.Id != id && x.CustomCategoryTypeId == model.CustomCategoryTypeId && x.IsDefault).ToList()
                                                .Select(x => { x.IsDefault = false; return x; }).FirstOrDefault());
            }


            if (model.Id == 0)
            {
                await customCategoryRepository.CreateAsync(customCategory);
            }
            else
            {
                await customCategoryRepository.UpdateAsync(customCategory);
            }
            return customCategory.Id;
        }
        public async Task<long> DeleteEntityAsync(long id)
        {
            CustomCategory category = await customCategoryRepository.FindOneAsync(x => x.Id == id);

            if (category == null)
            {
                throw new ItmNotFoundException("Category not found");
            }

            if (category.IsDefault)
            {
                throw new ItmInvalidDataException("Default category cannot be deleted.");
            }

            customCategoryRepository.Attach(customCategoryRepository
                .Where(c => c.CustomCategoryTypeId == category.CustomCategoryTypeId && c.DisplayOrder > category.DisplayOrder).OrderBy(x => x.DisplayOrder).ToList()
              .Select(x => { x.DisplayOrder -= 1; return x; }).ToList());

            return await customCategoryRepository.DeleteAsync(category);
        }
        public async Task<bool> DeleteEntitiesAsync(List<long> ids)
        {
            if (ids == null)
            {
                throw new ItmArgumentMissingException("Category not found");
            }

            if (!await customCategoryRepository.ExistsAsync(x => ids.Contains(x.Id)))
            {
                throw new ItmArgumentMissingException("Category not found");
            }
            //TODO: need rearrange display order
            return await customCategoryRepository.DeleteAsync(t => ids.Contains(t.Id)) > 0;

        }
        public async Task<bool> MoveUpCategoriesAsync(long id)
        {
            if (id > 0)
            {
                var customCategory = await customCategoryRepository.FindOneAsync(x => x.Id == id);

                if (customCategory == null)
                {
                    throw new ItmNotFoundException("Category not found for move up");
                }

                var customCategoryUp = customCategoryRepository.Where(x => x.DisplayOrder < customCategory.DisplayOrder && x.CustomCategoryTypeId == customCategory.CustomCategoryTypeId)
                                    .OrderByDescending(x => x.DisplayOrder).FirstOrDefault();

                if (customCategoryUp != null)
                {


                    int currentDO = customCategory.DisplayOrder;

                    customCategory.DisplayOrder = customCategoryUp.DisplayOrder;
                    customCategoryUp.DisplayOrder = currentDO;

                    return customCategoryRepository.SaveChanges() > 0;
                }
            }


            return false;
        }
        public async Task<bool> MoveDownCategoriesAsync(long id)
        {
            if (id > 0)
            {
                var customCategory = await customCategoryRepository.FindOneAsync(x => x.Id == id);

                if (customCategory == null)
                {
                    throw new ItmNotFoundException("Category not found for move down");
                }

                var customCategoryDown = customCategoryRepository.Where(x => x.DisplayOrder > customCategory.DisplayOrder && x.CustomCategoryTypeId == customCategory.CustomCategoryTypeId)
                                    .OrderBy(x => x.DisplayOrder).FirstOrDefault();

                if (customCategoryDown != null)
                {
                    int currentDO = customCategory.DisplayOrder;

                    customCategory.DisplayOrder = customCategoryDown.DisplayOrder;
                    customCategoryDown.DisplayOrder = currentDO;

                    return customCategoryRepository.SaveChanges() > 0;
                }
            }


            return false;
        }

        #endregion
    }
}
