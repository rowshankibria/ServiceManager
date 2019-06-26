using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class CustomCategory
    {
        public CustomCategory()
        {
            Addresses = new HashSet<Address>();
            CompanyCompanyTypes = new HashSet<Company>();
            CompanyIndustryTypes = new HashSet<Company>();
            CompanyPreferredContactMethods = new HashSet<Company>();
            CompanyRatingTypes = new HashSet<Company>();
            ContactGenders = new HashSet<Contact>();
            ContactImTypes = new HashSet<Contact>();
            ContactPostions = new HashSet<Contact>();
            ContactPreferredContactMethods = new HashSet<Contact>();
            ContactTitles = new HashSet<Contact>();
            Documents = new HashSet<Document>();
            EmployeeDepartments = new HashSet<Employee>();
            EmployeeEmploymentTypes = new HashSet<Employee>();
            LoanApplications = new HashSet<LoanApplication>();
            LoanDocumentTypes = new HashSet<LoanDocumentType>();
        }

        public long Id { get; set; }
        public string Code { get; set; }
        public long CustomCategoryTypeId { get; set; }
        public long? CustomCategoryMapTypeOptionId { get; set; }
        public string Name { get; set; }
        public string Desciption { get; set; }
        public bool IsDefault { get; set; }
        public bool IsActive { get; set; }
        public int DisplayOrder { get; set; }

        public CustomCategoryMapTypeOption CustomCategoryMapTypeOption { get; set; }
        public CustomCategoryType CustomCategoryType { get; set; }
        public ICollection<Address> Addresses { get; set; }
        public ICollection<Company> CompanyCompanyTypes { get; set; }
        public ICollection<Company> CompanyIndustryTypes { get; set; }
        public ICollection<Company> CompanyPreferredContactMethods { get; set; }
        public ICollection<Company> CompanyRatingTypes { get; set; }
        public ICollection<Contact> ContactGenders { get; set; }
        public ICollection<Contact> ContactImTypes { get; set; }
        public ICollection<Contact> ContactPostions { get; set; }
        public ICollection<Contact> ContactPreferredContactMethods { get; set; }
        public ICollection<Contact> ContactTitles { get; set; }
        public ICollection<Document> Documents { get; set; }
        public ICollection<Employee> EmployeeDepartments { get; set; }
        public ICollection<Employee> EmployeeEmploymentTypes { get; set; }
        public ICollection<LoanApplication> LoanApplications { get; set; }
        public ICollection<LoanDocumentType> LoanDocumentTypes { get; set; }
    }
}
