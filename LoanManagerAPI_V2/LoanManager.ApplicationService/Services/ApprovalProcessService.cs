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
    public class ApprovalProcessService : BaseService, IApprovalProcessService
    {
        private readonly IRepository<ApprovalProcess> approvalProcessRepository;
        private readonly IRepository<ApprovalProcessStep> approvalProcessStepRepository;
        private readonly IRepository<ApprovalProcessStepChecklist> approvalProcessStepChecklistRepository;
        private readonly IRepository<ApproverGroup> approverGroupRepository;
        private readonly IRepository<ApproverGroupMember> approverGroupMemberRepository;
        private readonly IRepository<Contact> contactRepository;
        private readonly IRepository<Employee> employeeRepository;
        private readonly IRepository<CustomCategory> customCategoryRepository;
        private readonly IRepository<BusinessCategory> businessCategoryRepository;
        private readonly IRepository<DocumentChecklist> documentChecklistRepository;
        /// <summary>
        /// constructor
        /// </summary>
        /// <param name="contactRepository"></param>
        /// <param name="logger"></param>
        /// <param name="mapper"></param>
        /// <param name="loggedInUserService"></param>
        public ApprovalProcessService(ILogger<ApprovalProcessService> logger,
            IMapper mapper,
            IRepository<ApprovalProcess> approvalProcessRepository,
            IRepository<ApproverGroup> approverGroupRepository,
            IRepository<BusinessCategory> businessCategoryRepository,
            IRepository<CustomCategory> customCategoryRepository,
            IRepository<Contact> contactRepository,
            IRepository<Employee> employeeRepository,
            IRepository<ApproverGroupMember> approverGroupMemberRepository,
            IRepository<DocumentChecklist> documentChecklistRepository,
            IRepository<ApprovalProcessStep> approvalProcessStepRepository,
            IRepository<ApprovalProcessStepChecklist> approvalProcessStepChecklistRepository,
             ILoggedInUserService loggedInUserService) : base(logger, mapper, loggedInUserService)
        {
            this.approverGroupMemberRepository = approverGroupMemberRepository;
            this.businessCategoryRepository = businessCategoryRepository;
            this.approverGroupRepository = approverGroupRepository;
            this.customCategoryRepository = customCategoryRepository;
            this.contactRepository = contactRepository;
            this.employeeRepository = employeeRepository;
            this.documentChecklistRepository = documentChecklistRepository;
            this.approvalProcessRepository = approvalProcessRepository;
            this.approvalProcessStepRepository = approvalProcessStepRepository;
            this.approvalProcessStepChecklistRepository = approvalProcessStepChecklistRepository;
        }

        #region Get Methods


        /// <summary>
        /// Get contacts by company
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public async Task<LoadResult> GetDevexApprovalProcessesAsynch(DataSourceLoadOptionsBase options)
        {
            var query = from c in this.approvalProcessRepository.GetAll().Include(t => t.ApprovalProcessSteps)
                        select new
                        {
                            c.Id,
                            c.Name,
                            c.Description,
                            ApprovalSteps = string.Join(", ", c.ApprovalProcessSteps.Select(p => p.Name)),
                        };


            return await Task.Run(() => DataSourceLoader.Load(query, options));

        }

        public async Task<LoadResult> GetApprovalProcessStepByIdAsync(long approvalProcessId, DataSourceLoadOptionsBase options)
        {
            var query = from c in this.approvalProcessStepRepository.GetAll().OrderBy(c => c.SortOrder).Include(t => t.ApproverGroup)
                        join app in this.approverGroupRepository.GetAll() on c.ApproverGroupId equals app.Id
                        where c.ApprovalProcessId == approvalProcessId
                        select new
                        {
                            c.Id,
                            c.Name,
                            ApproverGroup = app.Name,
                            c.IsFinalStep,
                            c.SortOrder
                        };

            return await Task.Run(() => DataSourceLoader.Load(query, options));

            //options.Select = new[] { "Id", "Contact.DisplayName", "IsActive" };
            //return await Task.Run(() => DataSourceLoader.Load(usersQuery, options));
        }

        /// <summary>
        /// 
        /// </summary>        
        /// <returns></returns>
        public List<SelectModel> GetApproverGroupAsync()
        {
            var query = from c in this.approverGroupRepository.GetAll()
                        select new SelectModel
                        {
                            Id = c.Id,
                            Name = c.Name
                        };

            return query.Distinct().ToList<SelectModel>();
        }

        /// <summary>
        /// 
        /// </summary>        
        /// <returns></returns>
        public List<SelectModel> GetDocumentChecklistAsync()
        {
            var query = from c in this.documentChecklistRepository.GetAll()
                        select new SelectModel
                        {
                            Id = c.Id,
                            Name = c.Title
                        };

            return query.Distinct().ToList<SelectModel>();
        }

        /// <summary>
        /// Get Entity by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<ApprovalProcessModel> GetEntityAsync(long id)
        {
            if (id == 0)
            {
                return new ApprovalProcessModel();
            }

            ApprovalProcess appProcess = await this.approvalProcessRepository.Where(x => x.Id == id)
                                                   .FirstOrDefaultAsync();

            if (appProcess == null)
            {
                throw new ItmNotFoundException("Approval Process not found");
            }

            var objApp = Mapper.Map<ApprovalProcessModel>(appProcess);

            //steps id list
            List<long> stepIds = this.approvalProcessStepRepository.Where(t => t.ApprovalProcessId == id).Select(t => t.Id).ToList();
            //List<long> documentChecklistIds = this.approvalProcessStepChecklistRepository.Where(t => stepIds.Contains(t.ApprovalProcessStepId))
            //.Select(t => t.Id).ToList();

            List<ApprovalProcessStepChecklist> documentChecklist = this.approvalProcessStepChecklistRepository
                                                                        .Where(t => stepIds.Contains(t.ApprovalProcessStepId))
                                                                        .Include(t => t.DocumentChecklist)
                                                                        .ToList();
            objApp.ApprovalStepIds = stepIds;
            //objApp.DocumentCheckIds = documentChecklistIds;
            objApp.ApprovalProcessStepCheckList = documentChecklist;

            return objApp;
        }

        public async Task<bool> MoveUpAsync(long id)
        {
            if (id > 0)
            {
                var appProcessStep = await approvalProcessStepRepository.FindOneAsync(x => x.Id == id);
                if (appProcessStep == null)
                {
                    throw new ItmNotFoundException("Approval Process Step not found for move up");
                }

                var appProcessStepUp = approvalProcessStepRepository.Where(x => x.SortOrder < appProcessStep.SortOrder)
                                                                    .OrderByDescending(x => x.SortOrder).FirstOrDefault();

                if (appProcessStepUp != null)
                {
                    int currentDO = appProcessStep.SortOrder.Value;
                    appProcessStep.SortOrder = appProcessStepUp.SortOrder;
                    appProcessStepUp.SortOrder = currentDO;
                    return approvalProcessStepRepository.SaveChanges() > 0;
                }
            }


            return false;
        }

        public async Task<bool> MoveDownAsync(long id)
        {
            if (id > 0)
            {
                var appProcessStep = await approvalProcessStepRepository.FindOneAsync(x => x.Id == id);
                if (appProcessStep == null)
                {
                    throw new ItmNotFoundException("Approval Process Step not found for move down");
                }

                var appProcessStepDown = approvalProcessStepRepository.Where(x => x.SortOrder > appProcessStep.SortOrder)
                                                                      .OrderBy(x => x.SortOrder).FirstOrDefault();

                if (appProcessStepDown != null)
                {
                    int currentDO = appProcessStep.SortOrder.Value;
                    appProcessStep.SortOrder = appProcessStepDown.SortOrder;
                    appProcessStepDown.SortOrder = currentDO;
                    return approvalProcessStepRepository.SaveChanges() > 0;
                }
            }


            return false;
        }

        #endregion

        #region Insert/Update/Delete Methods

        /// <summary>
        /// Insert/update entity
        /// </summary>
        /// <param name="contactModel"></param>
        /// <returns></returns>
        public async Task<long> SaveEntityAsync(ApprovalProcessModel approvalProcess)
        {
            if (approvalProcess == null)
            {
                throw new ItmArgumentMissingException("Approval Process not found");
            }

            ApprovalProcess appProcess = new ApprovalProcess();

            if (approvalProcess.Id > 0)
            {
                appProcess = this.approvalProcessRepository.Where(b => b.Id == approvalProcess.Id)
                                                           .FirstOrDefault();

                if (appProcess == null)
                {
                    throw new ItmNotFoundException("Approval Process not found");
                }
            }


            if (appProcess != null)
            {
                //var approverMember = approverGroup.ApproverGroupMembers;
                //approvalProcess.ApproverGroupMembers = null;
                Mapper.Map(approvalProcess, appProcess);


                if (approvalProcess.Id == 0)
                {
                    await approvalProcessRepository.CreateAsync(appProcess);
                }
                else
                {

                    await approvalProcessRepository.UpdateAsync(appProcess);
                }

            }
            return appProcess.Id;
        }

        /// <summary>
        /// Insert/update entity
        /// </summary>
        /// <param name="contactModel"></param>
        /// <returns></returns>
        public async Task<long> SaveApprovalStepAsync(ApprovalProcessModel approvalProcess)
        {
            if (approvalProcess == null)
            {
                throw new ItmArgumentMissingException("Approval Process not found");
            }
            else
            {
                var result = this.ValidateApproverGroupForStepByProcessId(approvalProcess.Id, approvalProcess.ApproverGroupId);
                if (!result)
                    throw new ItmInvalidDataException("Approver Group cannot be duplicated for an approval process.");

                result = this.ValidateStepName(approvalProcess.Id, approvalProcess.ApprovalStepName);
                if (!result)
                    throw new ItmInvalidDataException("Step name cannot be duplicated.");
            }

            ApprovalProcessStep appProcessStep = new ApprovalProcessStep();

            if (appProcessStep != null)
            {
                appProcessStep.Name = approvalProcess.ApprovalStepName;
                appProcessStep.ApproverGroupId = approvalProcess.ApproverGroupId;
                appProcessStep.SortOrder = this.GetNextApprovalProcessStep(approvalProcess.Id);
                appProcessStep.IsFinalStep = approvalProcess.IsFinalStep;
                if (approvalProcess.Id > 0)
                    appProcessStep.ApprovalProcessId = approvalProcess.Id;

                foreach (long id in approvalProcess.DocumentCheckIds)
                {
                    ApprovalProcessStepChecklist objChecklist = new ApprovalProcessStepChecklist();
                    objChecklist.DocumentChecklistId = id;
                    appProcessStep.ApprovalProcessStepChecklists.Add(objChecklist);
                }


                //if (approvalProcess.Id == 0)
                //{
                //    await approvalProcessRepository.CreateAsync(appProcess);
                //}
                //else
                //{

                //    await approvalProcessRepository.UpdateAsync(appProcess);
                //}

                await approvalProcessStepRepository.CreateAsync(appProcessStep);

            }
            return 0;
        }

        /// <summary>
        /// validate approver group by approval process step
        /// </summary>
        /// <param name="approvalProcessId"></param>
        /// <param name="approvalGroupId"></param>
        /// <returns></returns>
        public bool ValidateApproverGroupForStepByProcessId(long approvalProcessId, long approvalGroupId)
        {
            bool isValidGroup = true;

            ApprovalProcessStep stepObj = this.approvalProcessStepRepository
                                              .Where(t => t.ApproverGroupId == approvalGroupId && t.ApprovalProcessId == approvalProcessId).FirstOrDefault();
            if (stepObj != null)
            {
                isValidGroup = false;
            }


            return isValidGroup;
        }

        /// <summary>
        /// check whether this username exists or not
        /// </summary>
        /// <param name="id"></param>
        /// <param name="username"></param>
        /// <returns></returns>
        public bool ValidateStepName(long approvalProcessId, string stepName)
        {
            bool isValidStepName = true;

            ApprovalProcessStep stepObj = this.approvalProcessStepRepository.Where(t => t.Name == stepName && t.ApprovalProcessId == approvalProcessId).FirstOrDefault();
            if (stepObj != null)
            {
                isValidStepName = false;
            }


            return isValidStepName;
        }

        /// <summary>
        /// GetNextApplicationID
        /// </summary>
        /// <returns></returns>
        public int GetNextApprovalProcessStep(long approvalProcessId)
        {
            int maxExistingId = this.approvalProcessStepRepository.GetAll().Where(t=>t.ApprovalProcessId == approvalProcessId).Count();
            return maxExistingId + 1;
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
                throw new ItmArgumentMissingException("Approval Process not found");
            }

            //if (!await loanTypeRepository.ExistsAsync(x => x.Id == id))
            //{
            //    throw new ItmArgumentMissingException("Loan Type not found");
            //}

            return await approvalProcessRepository.DeleteAsync(t => t.Id == id) > 0;
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
                throw new ItmArgumentMissingException("Approval Process not found");
            }
            foreach (long id in ids)
            {
                //if (!await loanTypeRepository.ExistsAsync(x => ids.Contains(x.Id)))
                //{
                //    throw new ItmArgumentMissingException("Loan Type not found");
                //}

                await approvalProcessRepository.DeleteAsync(t => t.Id == id);
            }
            return true;
        }


        #endregion

        #region Validations Methods



        #endregion

    }
}
