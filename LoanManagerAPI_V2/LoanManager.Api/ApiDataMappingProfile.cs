using LoanManager.Api.Providers;
using LoanManager.ApplicationService.Models;
using LoanManager.Data.Models;


namespace LoanManager.Api
{
    /// <summary>
    /// 
    /// </summary>
    public class ApiDataMappingProfile : MappingProfile
    {
        /// <summary>
        /// 
        /// </summary>
        public ApiDataMappingProfile()
        {
            CreateMap<SystemUser, UserModel>();
            CreateMap<SystemRole, RoleModel>();
            CreateMap<Contact, ContactModel>();
            CreateMap<Photo, PhotoModel>();
            CreateMap<LoanApplication, LoanApplicationModel>();
            CreateMap<LoanType, LoanTypeModel>();

            CreateMap<ApplicationCustomField, ApplicationCustomFieldModel>();
            CreateMap<CustomFieldMaster, CustomFieldMasterModel>();

            CreateMap<Company, CompanyModel>();
            CreateMap<Branch, BranchModel>();
            CreateMap<CustomCategory, CustomCategoryModel>();
            CreateMap<Employee, EmployeeModel>();
            CreateMap<ApproverGroup, ApproverGroupModel>();
            CreateMap<ApprovalProcess, ApprovalProcessModel>();
            CreateMap<DocumentChecklist, DocumentChecklistModel>();
        }
    }
}
