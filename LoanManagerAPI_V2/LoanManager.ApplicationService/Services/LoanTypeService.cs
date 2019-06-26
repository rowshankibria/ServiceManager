using AutoMapper;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using LoanManager.ApplicationService.Models;
using LoanManager.Configuration;
using LoanManager.Data;
using LoanManager.Data.Models;
using LoanManager.Shared;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
    public class LoanTypeService : BaseService, ILoanTypeService
    {
        private readonly IRepository<LoanType> loanTypeRepository;
        private readonly IRepository<LoanDocumentType> loanDocumentTypeRepository;
        private readonly IRepository<ApprovalProcess> approvalProcessRepository;
        private readonly IRepository<LoanTypeApprovalProcess> loanTypeApprovalRepository;
        private readonly IRepository<CustomFieldMaster> customFieldRepository;
        private readonly IRepository<ApplicationCustomField> applicationCustomFieldRepository;
        /// <summary>
        /// constructor
        /// </summary>
        /// <param name="contactRepository"></param>
        /// <param name="logger"></param>
        /// <param name="mapper"></param>
        /// <param name="loggedInUserService"></param>
        public LoanTypeService(ILogger<LoanTypeService> logger,
            IMapper mapper,
            IRepository<LoanType> loanTypeRepository,
            IRepository<LoanDocumentType> loanDocumentTypeRepository,
            IRepository<LoanTypeApprovalProcess> loanTypeApprovalRepository,
            IRepository<CustomFieldMaster> customFieldRepository,
            IRepository<ApplicationCustomField> applicationCustomFieldRepository,
            IRepository<ApprovalProcess> approvalProcessRepository,
             ILoggedInUserService loggedInUserService) : base(logger, mapper, loggedInUserService)
        {

            this.loanTypeApprovalRepository = loanTypeApprovalRepository;
            this.customFieldRepository = customFieldRepository;
            this.loanTypeRepository = loanTypeRepository;
            this.applicationCustomFieldRepository = applicationCustomFieldRepository;
            this.approvalProcessRepository = approvalProcessRepository;
            this.loanDocumentTypeRepository = loanDocumentTypeRepository;
        }

        #region Get Methods


        /// <summary>
        /// Get contacts by company
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public async Task<IQueryable> GetLoanTypes()
        {

            var query = from c in this.loanTypeRepository.GetAll()
                        select new
                        {
                            c.Id,
                            Name = c.Name,
                            c.Description,
                            c.MinimumAmount,
                            c.MaximumAmount
                        };


            return await Task.Run(() => query.AsQueryable());
        }

        /// <summary>
        /// Get contacts by company
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public async Task<LoadResult> GetDevexLoanTypesAsynch(DataSourceLoadOptionsBase options)
        {
            var query = from c in this.loanTypeRepository.GetAll()
                        select new
                        {
                            c.Id,
                            c.Name,
                            c.Description,
                            c.MinimumAmount,
                            c.MaximumAmount
                        };


            return await Task.Run(() => DataSourceLoader.Load(query, options));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public async Task<LoadResult> GetDevexLoanTypeCustomFieldsAsync(long loanTypeId, DataSourceLoadOptionsBase options)
        {
            var query = from c in this.customFieldRepository.GetAll().Include(t => t.ControlType)
                        where c.EntityId == loanTypeId
                        orderby c.ControlSortOrder
                        select new
                        {
                            c.Id,
                            c.GroupName,
                            c.Name,
                            c.Caption,
                            ControlName = c.ControlType.Name,
                            ControlOptionValue = c.ControlsOptionValue,
                            c.IsMandatory,
                            c.ControlSortOrder
                        };


            return await Task.Run(() => DataSourceLoader.Load(query, options));
        }

        /// <summary>
        /// 
        /// </summary>        
        /// <returns></returns>
        public List<SelectModel> GetApprovalProcessAsync()
        {
            var query = from c in this.approvalProcessRepository.GetAll()
                        select new SelectModel
                        {
                            Id = c.Id,
                            Name = c.Name
                        };

            return query.Distinct().ToList<SelectModel>();
        }


        /// <summary>
        /// Get Entity by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<LoanTypeModel> GetEntityAsync(long id)
        {
            if (id == 0)
            {
                return new LoanTypeModel();
            }

            LoanType loanType = await loanTypeRepository.Where(x => x.Id == id)
                                                        //.Include(x => x.CustomFieldMasters)
                                                        .Include(x => x.LoanTypeApprovalProcesses)
                                                        .Include(x=>x.LoanDocumentTypes)
                                                        .FirstOrDefaultAsync();

            if (loanType == null)
            {
                throw new ItmNotFoundException("Loan Type not found");
            }

            var loanObj = Mapper.Map<LoanTypeModel>(loanType);

            //loan document types has any list record
            if(loanType.LoanDocumentTypes.Count() > 0)
                loanObj.DocumentCategoryIds = loanType.LoanDocumentTypes.Select(t => t.CategoryTypeId).ToList();

            if (loanType.LoanTypeApprovalProcesses.Count > 0)
            {
                loanObj.ApprovalProcessId = loanType.LoanTypeApprovalProcesses.FirstOrDefault().ApprovalProcessId;
            }

            return loanObj;
        }

        #endregion

        #region Insert/Update/Delete Methods

        /// <summary>
        /// Insert/update entity
        /// </summary>
        /// <param name="contactModel"></param>
        /// <returns></returns>
        public async Task<long> SaveEntityAsync(LoanTypeModel loanTypeModel)
        {
            if (loanTypeModel == null)
            {
                throw new ItmArgumentMissingException("Loan Type not found");
            }

            LoanType loanType = new LoanType();

            if (loanTypeModel.Id > 0)
            {

                loanType = loanTypeRepository.Where(b => b.Id == loanTypeModel.Id).Include(t => t.LoanTypeApprovalProcesses).FirstOrDefault();

                if (loanType == null)
                {
                    throw new ItmNotFoundException("Loan Type not found");
                }
            }


            if (loanType != null)
            {
                //Mapper.Map(loanTypeModel, loanType);
                loanType.Id = loanTypeModel.Id;
                loanType.Name = loanTypeModel.Name;
                loanType.Description = loanTypeModel.Description;
                loanType.MinimumAmount = loanTypeModel.MinimumAmount;
                loanType.MaximumAmount = loanTypeModel.MaximumAmount;
                loanType.CustomFieldMasters = null;

                if (loanTypeModel.ApprovalProcessId > 0)
                {
                    if (loanTypeModel.Id > 0)
                    {
                        var loanApprovalProcessObj = loanType.LoanTypeApprovalProcesses.FirstOrDefault();
                        if (loanApprovalProcessObj != null)
                        {
                            loanApprovalProcessObj.ApprovalProcessId = loanTypeModel.ApprovalProcessId.Value;
                        }
                        else
                        {
                            LoanTypeApprovalProcess objProcess = new LoanTypeApprovalProcess();
                            objProcess.ApprovalProcessId = loanTypeModel.ApprovalProcessId.Value;
                            loanType.LoanTypeApprovalProcesses.Add(objProcess);
                        }
                    }
                    else
                    {
                        LoanTypeApprovalProcess objProcess = new LoanTypeApprovalProcess();
                        objProcess.ApprovalProcessId = loanTypeModel.ApprovalProcessId.Value;
                        loanType.LoanTypeApprovalProcesses.Add(objProcess);
                    }
                }


                if (loanTypeModel.Id == 0)
                {
                    await loanTypeRepository.CreateAsync(loanType);
                    this.AddLoanCategoryType(loanTypeModel.DocumentCategoryIds, loanType.Id);
                }
                else
                {

                    await loanTypeRepository.UpdateAsync(loanType);
                    this.UpdateLoanCategoryType(loanTypeModel.DocumentCategoryIds, loanType.Id);
                }

            }
            return loanType.Id;
        }

        /// <summary>
        /// add loan category type
        /// </summary>
        public void AddLoanCategoryType(List<long> ids, long loanTypeId)
        {
            foreach(long id in ids)
            {
                LoanDocumentType objDocumentType = new LoanDocumentType();
                objDocumentType.LoanTypeId = loanTypeId;
                objDocumentType.CategoryTypeId = id;
                this.loanDocumentTypeRepository.Create(objDocumentType);
            }
        }

        /// <summary>
        /// add loan category type
        /// </summary>
        public void UpdateLoanCategoryType(List<long> ids, long loanTypeId)
        {
            //delete previous record
            List<LoanDocumentType> documentTypeList = this.loanDocumentTypeRepository.Where(t => t.LoanTypeId == loanTypeId).ToList();
            foreach(var obj in documentTypeList)
            {
                this.loanDocumentTypeRepository.Delete(obj);
            }

            foreach (long id in ids)
            {
                LoanDocumentType objDocumentType = new LoanDocumentType();
                objDocumentType.LoanTypeId = loanTypeId;
                objDocumentType.CategoryTypeId = id;
                this.loanDocumentTypeRepository.Create(objDocumentType);
            }
        }

        /// <summary>
        /// update loan category type
        /// </summary>
        public void UpdateLoanCategoryType()
        {

        }

        /// <summary>
        /// Insert/update custom field
        /// </summary>
        /// <param name="loanTypeModel"></param>
        /// <returns></returns>
        public async Task<long> SaveCustomFieldAsync(LoanTypeModel loanTypeModel)
        {
            if (loanTypeModel == null)
            {
                throw new ItmArgumentMissingException("Loan Type not found");
            }

            if (loanTypeModel.Id > 0)
            {
                CustomFieldMaster customField = new CustomFieldMaster();
                customField.EntityTypeId = ApplicationEntityType.LoanType;
                customField.EntityId = loanTypeModel.Id;
                customField.GroupName = loanTypeModel.CustomFieldModel.CustomFieldGroupName;
                customField.Name = loanTypeModel.CustomFieldModel.CustomFieldName;
                customField.Caption = loanTypeModel.CustomFieldModel.CustomFieldCaption;
                customField.ControlTypeId = loanTypeModel.CustomFieldModel.CustomFieldControlTypeId;
                customField.IsMandatory = loanTypeModel.CustomFieldModel.IsCustomFieldMandatory;
                customField.ControlsOptionValue = loanTypeModel.CustomFieldModel.CustomFieldSelectionValue;
                customField.GroupSortOrder = this.GetCustomFieldGroupSortOrder(customField.GroupName, loanTypeModel.Id);
                customField.ControlSortOrder = this.GetCustomFieldSortOrder(loanTypeModel.Id, customField.GroupName);//loanTypeModel.CustomFieldModel.ControlSortOrder;

                await customFieldRepository.CreateAsync(customField);
            }

            return 0;
        }

        /// <summary>
        /// Insert/update custom field
        /// </summary>
        /// <param name="loanTypeModel"></param>
        /// <returns></returns>
        public async Task<long> UpdateCustomFieldAsync(LoanTypeModel loanTypeModel)
        {
            if (loanTypeModel == null)
            {
                throw new ItmArgumentMissingException("Loan Type not found");
            }

            if (loanTypeModel.Id > 0)
            {
                if (loanTypeModel.CustomFieldModel.Id > 0)
                {
                    CustomFieldMaster customField = this.customFieldRepository.GetAll().FirstOrDefault(t => t.Id == loanTypeModel.CustomFieldModel.Id);
                    if (customField != null)
                    {
                        customField.GroupName = loanTypeModel.CustomFieldModel.CustomFieldGroupName;
                        customField.Name = loanTypeModel.CustomFieldModel.CustomFieldName;
                        customField.Caption = loanTypeModel.CustomFieldModel.CustomFieldCaption;
                        customField.ControlTypeId = loanTypeModel.CustomFieldModel.CustomFieldControlTypeId;
                        customField.IsMandatory = loanTypeModel.CustomFieldModel.IsCustomFieldMandatory;
                        customField.ControlsOptionValue = loanTypeModel.CustomFieldModel.CustomFieldSelectionValue;
                        customField.GroupSortOrder = this.GetCustomFieldGroupSortOrder(customField.GroupName, loanTypeModel.Id);
                        customField.ControlSortOrder = loanTypeModel.CustomFieldModel.ControlSortOrder;
                        await customFieldRepository.UpdateAsync(customField);
                    }
                }
                else
                {
                    throw new ItmArgumentMissingException("Custom field not found to update");
                }
            }

            return 0;
        }

        /// <summary>
        /// Update Group or Field Order
        /// </summary>
        /// <param name="loanTypeId"></param>
        /// <param name="groupName"></param>
        /// <param name="controlTypeId"></param>
        /// <param name="isDown"></param>
        /// <param name="isGroupSort"></param>
        /// <returns>Boolean</returns>
        public async Task<bool> UpdateGroupOrFieldOrder(long loanTypeId, string groupName, long controlId, bool isDown, bool isGroupSort)
        {
            bool isSucceed = false;
            var customField = this.customFieldRepository.GetAll().FirstOrDefault(t => t.Id == controlId);
            if (customField == null)
            {
                throw new ItmArgumentMissingException("Not found");
            }

            if (isGroupSort && !string.IsNullOrEmpty(groupName))
            {
                var currentGroup = this.customFieldRepository.GetAll().FirstOrDefault(t => t.GroupName == groupName && t.Id == controlId);
                if (currentGroup != null)
                {
                    if (isDown)
                    {
                        var siblingGroup = this.customFieldRepository.GetAll().FirstOrDefault(g => g.GroupSortOrder == currentGroup.GroupSortOrder + 1 && g.EntityId == loanTypeId);
                        if (siblingGroup == null)
                        {
                            throw new ItmArgumentMissingException("No adjacent group found to update order");
                        }

                        var groups = this.customFieldRepository.Where(g => g.GroupName == siblingGroup.GroupName && g.EntityId == loanTypeId).ToList();
                        if (groups != null && groups.Count > 0)
                        {
                            var siblingSortOrder = siblingGroup.GroupSortOrder;
                            var currentSortOrder = currentGroup.GroupSortOrder;
                            foreach (var item in groups)
                            {
                                item.GroupSortOrder = currentSortOrder;

                                //await customFieldRepository.UpdateAsync(item);
                            }

                            await customFieldRepository.UpdateAsync(groups);

                            var CurrentGroups = this.customFieldRepository.Where(g => g.GroupName == groupName && g.EntityId == loanTypeId).ToList();
                            if (CurrentGroups != null && CurrentGroups.Count > 0)
                            {
                                foreach (var item in CurrentGroups)
                                {
                                    item.GroupSortOrder = siblingSortOrder;

                                    //await customFieldRepository.UpdateAsync(item);
                                }

                                await customFieldRepository.UpdateAsync(CurrentGroups);
                            }

                            await customFieldRepository.SaveChangesAsync();
                            isSucceed = true;
                        }
                    }
                    else
                    {
                        var siblingGroup = this.customFieldRepository.GetAll().FirstOrDefault(g => g.GroupSortOrder == currentGroup.GroupSortOrder - 1 && g.EntityId == loanTypeId);
                        if (siblingGroup == null)
                        {
                            throw new ItmArgumentMissingException("No adjacent group found to update order");
                        }

                        var groups = this.customFieldRepository.Where(g => g.GroupName == siblingGroup.GroupName && g.EntityId == loanTypeId).ToList();
                        if (groups != null && groups.Count > 0)
                        {
                            var siblingSortOrder = siblingGroup.GroupSortOrder;
                            var currentSortOrder = currentGroup.GroupSortOrder;
                            foreach (var item in groups)
                            {
                                item.GroupSortOrder = currentSortOrder;
                            }

                            await customFieldRepository.UpdateAsync(groups);

                            var CurrentGroups = this.customFieldRepository.Where(g => g.GroupName == groupName && g.EntityId == loanTypeId).ToList();
                            if (CurrentGroups != null && CurrentGroups.Count > 0)
                            {
                                foreach (var item in CurrentGroups)
                                {
                                    item.GroupSortOrder = siblingSortOrder;
                                }

                                await customFieldRepository.UpdateAsync(CurrentGroups);
                            }

                            await customFieldRepository.SaveChangesAsync();
                            isSucceed = true;
                        }
                    }
                }
            }
            else if (controlId > 0)
            {
                var currentControl = this.customFieldRepository.GetAll().FirstOrDefault(t => t.Id == controlId);
                if (currentControl != null)
                {
                    if (isDown)
                    {
                        var candidateControl = this.customFieldRepository.GetAll().FirstOrDefault(g => g.ControlSortOrder == currentControl.ControlSortOrder + 1 
                                               && g.GroupName == currentControl.GroupName && g.EntityId == loanTypeId);
                        if (candidateControl != null)
                        {
                            var siblingSortOrder = candidateControl.ControlSortOrder;
                            var currentSortOrder = currentControl.ControlSortOrder;

                            candidateControl.ControlSortOrder = currentSortOrder;
                            await customFieldRepository.UpdateAsync(candidateControl);

                            currentControl.ControlSortOrder = siblingSortOrder;
                            await customFieldRepository.UpdateAsync(currentControl);

                            await customFieldRepository.SaveChangesAsync();
                            isSucceed = true;
                        }
                    }
                    else
                    {
                        var candidateControl = this.customFieldRepository.GetAll().FirstOrDefault(g => g.ControlSortOrder == currentControl.ControlSortOrder - 1
                                               && g.GroupName == currentControl.GroupName && g.EntityId == loanTypeId);
                        if (candidateControl != null)
                        {
                            var siblingSortOrder = candidateControl.ControlSortOrder;
                            var currentSortOrder = currentControl.ControlSortOrder;

                            candidateControl.ControlSortOrder = currentSortOrder;
                            await customFieldRepository.UpdateAsync(candidateControl);

                            currentControl.ControlSortOrder = siblingSortOrder;
                            await customFieldRepository.UpdateAsync(currentControl);

                            await customFieldRepository.SaveChangesAsync();
                            isSucceed = true;
                        }
                    }
                }
            }

            return isSucceed;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="groupName"></param>
        /// <param name="entityId"></param>
        /// <returns></returns>
        private int GetCustomFieldGroupSortOrder(string groupName, long entityId)
        {
            int groupSortOrderId = 1;

            if (this.customFieldRepository.GetAll().Any(t => t.EntityId == entityId && t.EntityTypeId == ApplicationEntityType.LoanType))
            {
                //if same group exists then get this group id 
                if (this.customFieldRepository.GetAll().Any(t => t.EntityId == entityId && t.EntityTypeId == ApplicationEntityType.LoanType
                                                         && t.GroupName == groupName))
                {
                    groupSortOrderId = this.customFieldRepository.GetAll().FirstOrDefault(t => t.EntityId == entityId && t.EntityTypeId == ApplicationEntityType.LoanType
                                                        && t.GroupName == groupName).GroupSortOrder;
                }
                else
                {
                    groupSortOrderId = this.customFieldRepository.GetAll().Where(t => t.EntityId == entityId && t.EntityTypeId == ApplicationEntityType.LoanType
                                                                                ).Max(t => t.GroupSortOrder);
                    groupSortOrderId++;
                }
            }

            return groupSortOrderId;
        }

        /// <summary>
        /// Get Custom Field Sort Order
        /// </summary>
        /// <param name="entityId"></param>
        /// <returns></returns>
        private int GetCustomFieldSortOrder(long entityId, string groupName)
        {
            int fieldSortOrderNumber = -1;

            if (this.customFieldRepository.GetAll().Any(t => t.EntityId == entityId && t.EntityTypeId == ApplicationEntityType.LoanType))
            {
                if (this.customFieldRepository.GetAll().Any(t => t.EntityId == entityId && t.EntityTypeId == ApplicationEntityType.LoanType
                                                         && t.GroupName == groupName))
                {
                    fieldSortOrderNumber = this.customFieldRepository.GetAll().Where(t => t.EntityId == entityId && t.GroupName == groupName && t.EntityTypeId == ApplicationEntityType.LoanType
                                                                                ).Max(t => t.ControlSortOrder);
                    fieldSortOrderNumber++;
                }
                else
                {
                    fieldSortOrderNumber++;
                }
            }

            return fieldSortOrderNumber;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="loanTypeModel"></param>
        /// <returns></returns>
        public async Task<long> UpdateGroup(LoanTypeModel loanTypeModel)
        {
            if (loanTypeModel == null)
            {
                throw new ItmArgumentMissingException("Loan Type not found");
            }

            if (loanTypeModel.Id > 0)
            {
                if (loanTypeModel.CustomFieldGroupSelectItems.Count > 0)
                {

                    foreach (var objGroup in loanTypeModel.CustomFieldGroupSelectItems)
                    {
                        List<CustomFieldMaster> objList = this.customFieldRepository.GetAll().Where(t => t.GroupName == objGroup.Name.ToString()).ToList();
                        foreach (var objMaster in objList)
                        {
                            objMaster.GroupSortOrder = objGroup.Id.ToInt();
                            this.customFieldRepository.Update(objMaster);
                        }
                    }

                }
                else
                {
                    throw new ItmArgumentMissingException("Custom field group not found to update");
                }
            }

            return 0;

        }


        /// <summary>
        /// get custom field model by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public CustomFieldModel GetCustomFieldModelById(long id)
        {
            CustomFieldModel customModel = new CustomFieldModel();
            var objCustomField = this.customFieldRepository.GetAll().FirstOrDefault(t => t.Id == id);
            if (objCustomField != null)
            {
                customModel.CustomFieldName = objCustomField.Name;
                customModel.CustomFieldCaption = objCustomField.Caption;
                customModel.CustomFieldControlTypeId = objCustomField.ControlTypeId;
                customModel.IsCustomFieldMandatory = objCustomField.IsMandatory.Value;
                customModel.CustomFieldGroupName = objCustomField.GroupName;
                customModel.CustomFieldSelectionValue = objCustomField.ControlsOptionValue;
                customModel.ControlSortOrder = objCustomField.ControlSortOrder;
                customModel.Id = objCustomField.Id;
            }

            return customModel;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="groupName"></param>
        /// <param name="entityId"></param>
        /// <returns></returns>
        public List<SelectModel> GetCustomFieldGroups(long loanTypeId)
        {
            var list = this.customFieldRepository.GetAll().Where(t => t.EntityId == loanTypeId && t.EntityTypeId == ApplicationEntityType.LoanType)
                                                .OrderBy(t => t.GroupSortOrder)
                                                .Select(m => new SelectModel { Name = m.GroupName, Id = m.GroupSortOrder })
                                                .Distinct()
                                                .OrderBy(t => t.Id.ToInt())
                                                .ToList();

            return list;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="groupName"></param>
        /// <param name="entityId"></param>
        /// <returns></returns>
        public List<CustomFieldModel> GetCustomFieldsByLoanId(long loanTypeId)
        {
            var list = this.customFieldRepository.GetAll().Where(t => t.EntityId == loanTypeId && t.EntityTypeId == ApplicationEntityType.LoanType)
                                                .OrderBy(t => t.GroupSortOrder)
                                                .ThenBy(t => t.ControlSortOrder)
                                                .Select(m => new CustomFieldModel {
                                                    Id = m.Id,
                                                    CustomFieldName = m.Name,
                                                    CustomFieldCaption = m.Caption,
                                                    CustomFieldControlTypeId = m.ControlTypeId,
                                                    IsCustomFieldMandatory = m.IsMandatory.Value,
                                                    CustomFieldGroupName = m.GroupName,
                                                    CustomFieldSelectionValue = m.ControlsOptionValue,
                                                    GroupSortOrder = m.GroupSortOrder,
                                                    ControlSortOrder = m.ControlSortOrder
                                                })
                                                .OrderBy(t => t.GroupSortOrder)
                                                .ThenBy(t => t.ControlSortOrder)
                                                .Distinct()
                                                .ToList();

            return list;
        }

        /// <summary>
        /// Delete entities by id list
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public async Task<bool> DeleteEntityAsync(long id)
        {
            if (id < 1)
            {
                throw new ItmArgumentMissingException("Loan Type not found");
            }

            if (!await loanTypeRepository.ExistsAsync(x => x.Id == id))
            {
                throw new ItmArgumentMissingException("Loan Type not found");
            }

            return await loanTypeRepository.DeleteAsync(t => t.Id == id) > 0;
        }

        /// <summary>
        /// Delete entities by id list
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public async Task<bool> DeleteCustomFieldEntityAsync(long id)
        {
            if (id < 1)
            {
                throw new ItmArgumentMissingException("Custom Field not found");
            }

            if (!await customFieldRepository.ExistsAsync(x => x.Id == id))
            {
                throw new ItmArgumentMissingException("Custom Field not found");
            }

            await this.applicationCustomFieldRepository.DeleteAsync(t => t.CustomFieldMasterId == id);

            return await customFieldRepository.DeleteAsync(t => t.Id == id) > 0;
        }

        /// <summary>
        /// Delete entities by id list
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public async Task<bool> DeleteEntitiesAsync(List<long> ids)
        {
            if (ids == null)
            {
                throw new ItmArgumentMissingException("Loan Type not found");
            }
            foreach (long id in ids)
            {
                if (!await loanTypeRepository.ExistsAsync(x => ids.Contains(x.Id)))
                {
                    throw new ItmArgumentMissingException("Loan Type not found");
                }

                await loanTypeRepository.DeleteAsync(t => t.Id == id);
            }
            return true;
        }

        #endregion

        #region Validations Methods



        #endregion

    }
}
