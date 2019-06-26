using LoanManager.Configuration;
using LoanManager.Data.Models;
using LoanManager.Data.StoredProcedureModel;
using LoanManager.Shared;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.Data
{
    public class StoredProcedureRepository : BaseRepository<ApplicationDbContext, object>, IStoredProcedureRepository
    {
        //private readonly ApplicationDbContext ApplicationDbContext;
        public StoredProcedureRepository(ApplicationDbContext context, ILoggedInUserService loggedInUserService) : base(context, loggedInUserService)
        {
            //this.context = context;
        }

        public List<Company> GetCompanies()
        {
            
            var reviewLocks = context.Companies.FromSql($"EXECUTE [Customer].[GetCompany] @BusinessProfileId",
                new SqlParameter("@BusinessProfileId", "93F8BB7E-6F37-4676-D5C7-A6DFC3050358"));

            List<Company> companies = context.Companies.FromSql($"EXECUTE [Customer].[GetCompany] '93F8BB7E-6F37-4676-D5C7-A6DFC3050358'").ToList();

            return companies;
        }

        public List<LoanApplicationSummary> GetLoanApplicationSummary()
        {
            List<LoanApplicationSummary> loanSummary = context.ApplicationSummaries.FromSql($"EXECUTE [core].[HBGetApplicationSummary]").ToList();
            return loanSummary;
        }

        public List<LoanApplicationBranchSummary> GetLoanApplicationBranchSummary()
        {
            List<LoanApplicationBranchSummary> branchSummary = context.ApplicationBranchSummaries.FromSql($"EXECUTE [core].[HBGetApplicationBranchSummary]").ToList();
            return branchSummary;
        }

        public List<LoanApplicationTotalSummary> GetLoanApplicationTotalSummary()
        {
            List<LoanApplicationTotalSummary> totalSummary = context.ApplicationTotalSummaries.FromSql($"EXECUTE [core].[HBGetApplicationSingleSummary]").ToList();
            return totalSummary;
        }

        public DeleteValidationSummary GetValidationSummary(int deletableEntityType, long id)
        {
            DeleteValidationSummary validationSummary = null;

            if (deletableEntityType == DeletableEntityType.BusinessProfile)
            {
                validationSummary = context.DeleteValidationSummaries.FromSql("EXECUTE [core].[LMSGetBusinessProfileDeleteValidationSummary] {0}", id).FirstOrDefault();
            }
            else if (deletableEntityType == DeletableEntityType.LoanApplication)
            {
                validationSummary = context.DeleteValidationSummaries.FromSql("EXECUTE [core].[LMSGetLoanApplicationDeleteValidationSummary] {0}", id).FirstOrDefault();
            }
            else if (deletableEntityType == DeletableEntityType.Client)
            {
                validationSummary = context.DeleteValidationSummaries.FromSql("EXECUTE [core].[LMSGetClientDeleteValidationSummary] {0}", id).FirstOrDefault();
            }
            else if (deletableEntityType == DeletableEntityType.Contact)
            {
                validationSummary = context.DeleteValidationSummaries.FromSql("EXECUTE [core].[LMSGetContactDeleteValidationSummary] {0}", id).FirstOrDefault();
            }
            else if (deletableEntityType == DeletableEntityType.Employee)
            {
                validationSummary = context.DeleteValidationSummaries.FromSql("EXECUTE [core].[LMSGetEmployeeDeleteValidationSummary] {0}", id).FirstOrDefault();
            }
            else if (deletableEntityType == DeletableEntityType.Region)
            {
                validationSummary = context.DeleteValidationSummaries.FromSql("EXECUTE [core].[LMSGetRegionDeleteValidationSummary] {0}", id).FirstOrDefault();
            }
            else if (deletableEntityType == DeletableEntityType.Branch)
            {
                validationSummary = context.DeleteValidationSummaries.FromSql("EXECUTE [core].[LMSGetBranchDeleteValidationSummary] {0}", id).FirstOrDefault();
            }
            else if (deletableEntityType == DeletableEntityType.User)
            {
                validationSummary = context.DeleteValidationSummaries.FromSql("EXECUTE [core].[LMSGetUserDeleteValidationSummary] {0}", id).FirstOrDefault();
            }
            else if (deletableEntityType == DeletableEntityType.Document)
            {
                validationSummary = context.DeleteValidationSummaries.FromSql("EXECUTE [core].[LMSGetDocumentDeleteValidationSummary] {0}", id).FirstOrDefault();
            }
            else if (deletableEntityType == DeletableEntityType.DocumentCheckList)
            {
                validationSummary = context.DeleteValidationSummaries.FromSql("EXECUTE [core].[LMSGetDocumentChecklistDeleteValidationSummary] {0}", id).FirstOrDefault();
            }
            else if (deletableEntityType == DeletableEntityType.LoanType)
            {
                validationSummary = context.DeleteValidationSummaries.FromSql("EXECUTE [core].[LMSGetLoanTypeDeleteValidationSummary] {0}", id).FirstOrDefault();
            }
            else if (deletableEntityType == DeletableEntityType.ApprovalGroup)
            {
                validationSummary = context.DeleteValidationSummaries.FromSql("EXECUTE [core].[LMSGetApprovalGroupDeleteValidationSummary] {0}", id).FirstOrDefault();
            }
            else if (deletableEntityType == DeletableEntityType.ApprovalProcess)
            {
                validationSummary = context.DeleteValidationSummaries.FromSql("EXECUTE [core].[LMSGetApprovalProcessDeleteValidationSummary] {0}", id).FirstOrDefault();
            }
            else if (deletableEntityType == DeletableEntityType.TypesAndCategory)
            {
                validationSummary = context.DeleteValidationSummaries.FromSql("EXECUTE [core].[LMSGetTypesAndCategoryDeleteValidationSummary] {0}", id).FirstOrDefault();
            }
            
            return validationSummary;
        }
    }
}
