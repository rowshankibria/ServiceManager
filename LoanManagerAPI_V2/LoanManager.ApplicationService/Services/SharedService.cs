using AutoMapper;
using LoanManager.Data;
using LoanManager.Data.Models;
using LoanManager.Shared;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
    public class SharedService : BaseService, ISharedService
    {
        private readonly IRepository<TimeZone> timeZoneRepository;
        private readonly IRepository<Country> countryRepository;
        private readonly IRepository<State> stateRepository;
        private readonly IRepository<LoanType> loanTypeRepository;
        private readonly IRepository<Branch> branchRepository;
        private readonly IRepository<Company> companyRepository;

        /// <summary>
        /// constructor
        /// </summary>
        /// <param name="timeZone"></param>
        /// <param name="logger"></param>
        /// <param name="mapper"></param>
        public SharedService(ILogger<SharedService> logger
            , IRepository<TimeZone> timeZoneRepository
            , IMapper mapper
            , ILoggedInUserService loggedInUserService
            , IRepository<Country> countryRepository
            , IRepository<State> stateRepository,
            IRepository<LoanType> loanTypeRepository,
            IRepository<Branch> branchRepository,
            IRepository<Company> companyRepository) : base(logger, mapper, loggedInUserService)
        {
            this.timeZoneRepository = timeZoneRepository;
            this.countryRepository = countryRepository;
            this.stateRepository = stateRepository;
            this.loanTypeRepository = loanTypeRepository;
            this.branchRepository = branchRepository;
            this.companyRepository = companyRepository;
        }

        public async Task<List<SelectModel>> GetCompanySelectItemsAsync()
        {
            return await Task.Run(() => companyRepository.GetAll()
               .OrderBy(t => t.CompanyName)
               .Select(x => new SelectModel
               {
                   Id = x.Id,
                   Name = x.CompanyName
               }).ToList());
        }

        public async Task<List<SelectModel>> GetBranchSelectItemsAsync()
        {
            return await Task.Run(() => branchRepository.GetAll()
               .OrderBy(t => t.BranchName)
               .Select(x => new SelectModel
               {
                   Id = x.Id,
                   Name = x.BranchName
               }).ToList());
        }

        public async Task<List<SelectModel>> GetCountrySelectItemsAsync()
        {
            return await Task.Run(() => countryRepository.GetAll()
               .OrderBy(t => t.CountryName)
               .Select(x => new SelectModel
               {
                   Id = x.Id,
                   Name = x.CountryName
               }).ToList());
        }

        public async Task<List<SelectModel>> GetLoanTypeSelectItemsAsync()
        {
            return await Task.Run(() => loanTypeRepository.GetAll()
               .OrderBy(t => t.Name)
               .Select(x => new SelectModel
               {
                   Id = x.Id,
                   Name = x.Name
               }).ToList());
        }

        public async Task<List<SelectModel>> GetStateSelectItemsAsync(long countryId)
        {
            return await Task.Run(() => stateRepository.Where(x => x.CountryId == countryId)
               .OrderBy(t => t.StateName)
               .Select(x => new SelectModel
               {
                   Id = x.Id,
                   Name = x.StateName
               }).ToList());
        }

        public async Task<List<SelectModel>> GetTimeZoneSelectItemsAsync()
        {
            return await Task.Run(() => timeZoneRepository.GetAll()
                .OrderBy(t => t.OffsetValueInMinutes)
                .ThenBy(t => t.DisplayName)
                .Select(x => new SelectModel
                {
                    Id = x.Id.ToString(),
                    Name = x.DisplayName,
                    Tag = x.OffsetValueInMinutes
                }).ToList());
        }
    }
}

