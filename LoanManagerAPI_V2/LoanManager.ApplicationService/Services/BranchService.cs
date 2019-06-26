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
    public class BranchService : BaseService, IBranchService
    {
        private readonly IRepository<Branch> branchRepository;
        private readonly IRepository<Company> regionRepository;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="mapper"></param>
        /// <param name="branchRepository"></param>
        /// <param name="loggedInUserService"></param>
        public BranchService(ILogger<BranchService> logger,
            IMapper mapper,
            IRepository<Branch> branchRepository,
            IRepository<Company> regionRepository,
            ILoggedInUserService loggedInUserService) : base(logger, mapper, loggedInUserService)
        {

            this.branchRepository = branchRepository;
            this.regionRepository = regionRepository;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public async Task<LoadResult> GetDevexBranchesAsynch(DataSourceLoadOptionsBase options)
        {
            var query = from c in this.branchRepository.GetAll()
                        join r in this.regionRepository.GetAll() on c.CompanyId equals r.Id
                        select new
                        {
                            c.Id,
                            c.BranchCode,
                            c.BranchName,
                            c.ContactPerson,
                            c.Address,
                            c.Phone,
                            c.Fax,
                            c.Email                            
                        };


            return await Task.Run(() => DataSourceLoader.Load(query, options));
        }

        /// <summary>
        /// Get Entity by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<BranchModel> GetEntityAsync(long id)
        {
            if (id == 0)
            {
                return new BranchModel();
            }

            Branch branch = await branchRepository.Where(x => x.Id == id).FirstOrDefaultAsync();

            if (branch == null)
            {
                throw new ItmNotFoundException("Branch not found");
            }


            return Mapper.Map<BranchModel>(branch);
        }


        #region Insert/Update/Delete Methods

        /// <summary>
        /// Insert/update entity
        /// </summary>
        /// <param name="contactModel"></param>
        /// <returns></returns>
        public async Task<long> SaveEntityAsync(BranchModel branchModel)
        {
            if (branchModel == null)
            {
                throw new ItmArgumentMissingException("Branch not found");
            }

            Branch branch = new Branch();

            if (branchModel.Id > 0)
            {
                branch = branchRepository.Where(b => b.Id == branchModel.Id).FirstOrDefault();

                if (branch == null)
                {
                    throw new ItmNotFoundException("Branch not found");
                }
            }


            if (branch != null)
            {
                Mapper.Map(branchModel, branch);

                if (branchModel.Id == 0)
                {
                    await branchRepository.CreateAsync(branch);
                }
                else
                {

                    await branchRepository.UpdateAsync(branch);
                }

            }
            return branch.Id;
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
                throw new ItmArgumentMissingException("Branch not found");
            }

            if (!await branchRepository.ExistsAsync(x => x.Id == id))
            {
                throw new ItmArgumentMissingException("Branch not found");
            }

            return await branchRepository.DeleteAsync(t => t.Id == id) > 0;
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
                throw new ItmArgumentMissingException("Branch not found");
            }
            foreach (long id in ids)
            {
                if (!await branchRepository.ExistsAsync(x => ids.Contains(x.Id)))
                {
                    throw new ItmArgumentMissingException("Branch not found");
                }

                await branchRepository.DeleteAsync(t => t.Id == id);
            }
            return true;
        }


        #endregion

        #region Validations Methods



        #endregion

    }
}
