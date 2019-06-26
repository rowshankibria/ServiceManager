using LoanManager.Api.Providers;
using LoanManager.ApplicationService.Models;
using LoanManager.Data.Models;

namespace LoanManager.Api
{
    /// <summary>
    /// 
    /// </summary>
    public class ApiServiceMappingProfile : MappingProfile
    {
        /// <summary>
        /// 
        /// </summary>
        public ApiServiceMappingProfile()
        {
            CreateMap<UserModel, SystemUser>();
            CreateMap<RoleModel, SystemRole>();
            CreateMap<ContactModel, Contact>();
            CreateMap<PhotoModel, Photo>();
            CreateMap<LoanApplicationModel, LoanApplication>();
            CreateMap<LoanTypeModel, LoanType>();

            CreateMap<ApplicationCustomFieldModel, ApplicationCustomField>();
            CreateMap<CustomFieldMasterModel, CustomFieldMaster>();
            CreateMap<CompanyModel, Company>();
            CreateMap<BranchModel, Branch>();
            CreateMap<CustomCategoryModel, CustomCategory>();
            CreateMap<EmployeeModel, Employee>();
            CreateMap<ApproverGroupModel, ApproverGroup>();
            CreateMap<ApprovalProcessModel, ApprovalProcess>();
            CreateMap<DocumentChecklistModel, DocumentChecklist>();
        }
    }
}
