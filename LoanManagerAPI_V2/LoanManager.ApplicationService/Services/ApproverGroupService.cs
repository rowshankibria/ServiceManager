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
    public class ApproverGroupService : BaseService, IApproverGroupService
    {
        private readonly IRepository<ApproverGroup> approverGroupRepository;
        private readonly IRepository<ApproverGroupMember> approverGroupMemberRepository;
        private readonly IRepository<Contact> contactRepository;
        private readonly IRepository<Employee> employeeRepository;
        private readonly IRepository<CustomCategory> customCategoryRepository;
        private readonly IRepository<BusinessCategory> businessCategoryRepository;
        /// <summary>
        /// constructor
        /// </summary>
        /// <param name="contactRepository"></param>
        /// <param name="logger"></param>
        /// <param name="mapper"></param>
        /// <param name="loggedInUserService"></param>
        public ApproverGroupService(ILogger<ApproverGroupService> logger,
            IMapper mapper,
            IRepository<ApproverGroup> approverGroupRepository,
            IRepository<BusinessCategory> businessCategoryRepository,
            IRepository<CustomCategory> customCategoryRepository,
            IRepository<Contact> contactRepository,
            IRepository<Employee> employeeRepository,
            IRepository<ApproverGroupMember> approverGroupMemberRepository,
             ILoggedInUserService loggedInUserService) : base(logger, mapper, loggedInUserService)
        {
            this.approverGroupMemberRepository = approverGroupMemberRepository;
            this.businessCategoryRepository = businessCategoryRepository;
            this.approverGroupRepository = approverGroupRepository;
            this.customCategoryRepository = customCategoryRepository;
            this.contactRepository = contactRepository;
            this.employeeRepository = employeeRepository;
        }

        #region Get Methods


        /// <summary>
        /// Get contacts by company
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public async Task<LoadResult> GetDevexApproverGroupsAsynch(DataSourceLoadOptionsBase options)
        {
            var query = from c in this.approverGroupRepository.GetAll().Include(t => t.ApproverGroupMembers)
                        join bcat in this.businessCategoryRepository.GetAll() on c.ApproverGroupTypeId equals bcat.Id
                        select new
                        {
                            c.Id,
                            c.Name,
                            c.Description,
                            ApproverGroupName = bcat.Name,
                            Approvers = string.Join(", ", c.ApproverGroupMembers.Select(p => p.Employee.Contact.FirstName.ToString() + " " + p.Employee.Contact.LastName.ToString())),
                        };


            return await Task.Run(() => DataSourceLoader.Load(query, options));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="entityType"></param>
        /// <returns></returns>
        public List<SelectModel> GetCreditOfficerEmployeeItemsAsync()
        {
            //position
            var query = from c in this.contactRepository.GetAll().Include(t => t.Employees)
                        join emp in this.employeeRepository.GetAll() on c.Id equals emp.ContactId
                        join pos in this.customCategoryRepository.GetAll() on c.PostionId equals pos.Id
                        where c.IsActive == true && c.ContactType == (int)LoanManager.Configuration.Enums.ContactType.Employee
                        && pos.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.Position.CreditOfficer
                        select new SelectModel
                        {
                            Id = emp.Id,
                            Name = c.FirstName + " " + c.LastName + " (Employee ID: " + emp.EmployeeId + ")"
                            //Name = c.FirstName + " " + c.LastName + " (Employee Id: " + emp.EmployeeId + ", Email: " + c.Email + ", Position: " + pos.Name + ")"
                        };


            return query.Distinct().ToList<SelectModel>();

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="entityType"></param>
        /// <returns></returns>
        public List<SelectModel> GetEmployeeItemsAsync(long entityType)
        {
            if (entityType == LoanManager.Configuration.ApproverGroupType.CreditOfficer)
            {
                //position
                var query = from c in this.contactRepository.GetAll().Include(t => t.Employees)
                            join emp in this.employeeRepository.GetAll() on c.Id equals emp.ContactId
                            join pos in this.customCategoryRepository.GetAll() on c.PostionId equals pos.Id
                            where c.IsActive == true && c.ContactType == (int)LoanManager.Configuration.Enums.ContactType.Employee
                            && pos.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.Position.CreditOfficer
                            select new SelectModel
                            {
                                Id = emp.Id,
                                Name = c.FirstName + " " + c.LastName + " (Employee Id: " + emp.EmployeeId + ", Email: " + c.Email + ", Position: " + pos.Name + ")"
                            };


                return query.Distinct().ToList<SelectModel>();


            }
            else if (entityType == LoanManager.Configuration.ApproverGroupType.BranchManager)
            {
                //position
                var query = from c in this.contactRepository.GetAll().Include(t => t.Employees)
                            join emp in this.employeeRepository.GetAll() on c.Id equals emp.ContactId
                            join pos in this.customCategoryRepository.GetAll() on c.PostionId equals pos.Id
                            where c.IsActive == true && c.ContactType == (int)LoanManager.Configuration.Enums.ContactType.Employee
                            && pos.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.Position.BranchManager
                            select new SelectModel
                            {
                                Id = emp.Id,
                                Name = c.FirstName + " " + c.LastName + " (Employee Id: " + emp.EmployeeId + ", Email: " + c.Email + ", Position: " + pos.Name + ")"
                            };


                return query.Distinct().ToList<SelectModel>();
            }
            else if (entityType == LoanManager.Configuration.ApproverGroupType.ClusterHead)
            {
                //position
                var query = from c in this.contactRepository.GetAll().Include(t => t.Employees)
                            join emp in this.employeeRepository.GetAll() on c.Id equals emp.ContactId
                            join pos in this.customCategoryRepository.GetAll() on c.PostionId equals pos.Id
                            where c.IsActive == true && c.ContactType == (int)LoanManager.Configuration.Enums.ContactType.Employee
                            && pos.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.Position.ClusterHead
                            select new SelectModel
                            {
                                Id = emp.Id,
                                Name = c.FirstName + " " + c.LastName + " (Employee Id: " + emp.EmployeeId + ", Email: " + c.Email + ", Position: " + pos.Name + ")"
                            };


                return query.Distinct().ToList<SelectModel>();
            }
            else if (entityType == LoanManager.Configuration.ApproverGroupType.CreditOperation)
            {
                //department
                var query = from c in this.contactRepository.GetAll().Include(t => t.Employees)
                            join emp in this.employeeRepository.GetAll() on c.Id equals emp.ContactId
                            join pos in this.customCategoryRepository.GetAll() on c.PostionId equals pos.Id
                            join dept in this.customCategoryRepository.GetAll() on emp.DepartmentId equals dept.Id
                            where c.IsActive == true && c.ContactType == (int)LoanManager.Configuration.Enums.ContactType.Employee
                            && dept.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.DepartmentType.CreditOperations
                            select new SelectModel
                            {
                                Id = emp.Id,
                                Name = c.FirstName + " " + c.LastName + " (Employee Id: " + emp.EmployeeId + ", Email: " + c.Email + ", Position: " + pos.Name + ")"
                            };


                return query.Distinct().ToList<SelectModel>();
            }
            else if (entityType == LoanManager.Configuration.ApproverGroupType.Risk_LegalAndCompliance)
            {
                //department

                var query = from c in this.contactRepository.GetAll().Include(t => t.Employees)
                            join emp in this.employeeRepository.GetAll() on c.Id equals emp.ContactId
                            join pos in this.customCategoryRepository.GetAll() on c.PostionId equals pos.Id
                            join dept in this.customCategoryRepository.GetAll() on emp.DepartmentId equals dept.Id
                            where c.IsActive == true && c.ContactType == (int)LoanManager.Configuration.Enums.ContactType.Employee
                            && dept.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.DepartmentType.RiskLegalNCompliance
                            select new SelectModel
                            {
                                Id = emp.Id,
                                Name = c.FirstName + " " + c.LastName + " (Employee Id: " + emp.EmployeeId + ", Email: " + c.Email + ", Position: " + pos.Name + ")"
                            };


                return query.Distinct().ToList<SelectModel>();
            }
            else if (entityType == LoanManager.Configuration.ApproverGroupType.DCEO_DGM)
            {
                //position                
                var query = from c in this.contactRepository.GetAll().Include(t => t.Employees)
                            join emp in this.employeeRepository.GetAll() on c.Id equals emp.ContactId
                            join pos in this.customCategoryRepository.GetAll() on c.PostionId equals pos.Id
                            where c.IsActive == true && c.ContactType == (int)LoanManager.Configuration.Enums.ContactType.Employee
                            && pos.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.Position.DCEO_DGMCEO
                            select new SelectModel
                            {
                                Id = emp.Id,
                                Name = c.FirstName + " " + c.LastName + " (Employee Id: " + emp.EmployeeId + ", Email: " + c.Email + ", Position: " + pos.Name + ")"
                            };


                return query.Distinct().ToList<SelectModel>();
            }
            else if (entityType == LoanManager.Configuration.ApproverGroupType.CEO)
            {
                //position
                var query = from c in this.contactRepository.GetAll().Include(t => t.Employees)
                            join emp in this.employeeRepository.GetAll() on c.Id equals emp.ContactId
                            join pos in this.customCategoryRepository.GetAll() on c.PostionId equals pos.Id
                            where c.IsActive == true && c.ContactType == (int)LoanManager.Configuration.Enums.ContactType.Employee
                            && pos.CustomCategoryMapTypeOptionId == LoanManager.Configuration.ApplicationMapType.Position.CEO
                            select new SelectModel
                            {
                                Id = emp.Id,
                                Name = c.FirstName + " " + c.LastName + " (Employee Id: " + emp.EmployeeId + ", Email: " + c.Email + ", Position: " + pos.Name + ")"
                            };


                return query.Distinct().ToList<SelectModel>();
            }


            return new List<SelectModel>();
        }


        /// <summary>
        /// Get Entity by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<ApproverGroupModel> GetEntityAsync(long id)
        {
            if (id == 0)
            {
                return new ApproverGroupModel();
            }

            ApproverGroup appGroup = await this.approverGroupRepository.Where(x => x.Id == id)
                                               .Include(x => x.ApproverGroupMembers).FirstOrDefaultAsync();

            if (appGroup == null)
            {
                throw new ItmNotFoundException("Approver Group not found");
            }

            var objApp = Mapper.Map<ApproverGroupModel>(appGroup);

            if (objApp != null)
            {
                //employee list
                if (appGroup.ApproverGroupMembers.Count > 0)
                    objApp.EmployeeIds = appGroup.ApproverGroupMembers.Select(t => t.EmployeeId).ToList();
            }

            return objApp;
        }

        #endregion

        #region Insert/Update/Delete Methods

        /// <summary>
        /// Insert/update entity
        /// </summary>
        /// <param name="contactModel"></param>
        /// <returns></returns>
        public async Task<long> SaveEntityAsync(ApproverGroupModel approverModel)
        {
            if (approverModel == null)
            {
                throw new ItmArgumentMissingException("Approver Group not found");
            }

            ApproverGroup approverGroup = new ApproverGroup();

            if (approverModel.Id > 0)
            {
                approverGroup = approverGroupRepository.Where(b => b.Id == approverModel.Id)
                                                       .Include(t => t.ApproverGroupMembers)
                                                       .FirstOrDefault();

                if (approverGroup == null)
                {
                    throw new ItmNotFoundException("Approver Group not found");
                }
            }


            if (approverGroup != null)
            {
                var approverMember = approverGroup.ApproverGroupMembers;
                approverModel.ApproverGroupMembers = null;
                Mapper.Map(approverModel, approverGroup);



                //if it is edit mode
                if (approverModel.Id > 0)
                {
                    //delete employee
                    var memberList = this.approverGroupMemberRepository.Where(t => t.ApprovalGroupId == approverModel.Id).ToList();
                    this.approverGroupMemberRepository.Remove(memberList);
                }

                //insert record for employee
                foreach (int entityid in approverModel.EmployeeIds)
                {
                    ApproverGroupMember member = new ApproverGroupMember();
                    member.EmployeeId = entityid;
                    approverGroup.ApproverGroupMembers.Add(member);
                }


                if (approverModel.Id == 0)
                {
                    await approverGroupRepository.CreateAsync(approverGroup);
                }
                else
                {

                    await approverGroupRepository.UpdateAsync(approverGroup);
                }

            }
            return approverGroup.Id;
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
                throw new ItmArgumentMissingException("Approver Group not found");
            }

            //if (!await loanTypeRepository.ExistsAsync(x => x.Id == id))
            //{
            //    throw new ItmArgumentMissingException("Loan Type not found");
            //}

            return await approverGroupRepository.DeleteAsync(t => t.Id == id) > 0;
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
                throw new ItmArgumentMissingException("Approver Group not found");
            }
            foreach (long id in ids)
            {
                //if (!await loanTypeRepository.ExistsAsync(x => ids.Contains(x.Id)))
                //{
                //    throw new ItmArgumentMissingException("Loan Type not found");
                //}

                await approverGroupRepository.DeleteAsync(t => t.Id == id);
            }
            return true;
        }


        #endregion

        #region Validations Methods



        #endregion

    }
}