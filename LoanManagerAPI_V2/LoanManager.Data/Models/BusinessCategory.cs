using System;
using System.Collections.Generic;

namespace LoanManager.Data.Models
{
    public partial class BusinessCategory
    {
        public BusinessCategory()
        {
            ApprovalEntityMappings = new HashSet<ApprovalEntityMapping>();
            ApproverGroups = new HashSet<ApproverGroup>();
            CustomFieldMasters = new HashSet<CustomFieldMaster>();
            CustomFieldValidations = new HashSet<CustomFieldValidation>();
            ServerAuthenticationTypes = new HashSet<Server>();
            ServerProtocols = new HashSet<Server>();
            ServerSenderOptions = new HashSet<Server>();
            Contacts = new HashSet<Contact>();
            Notes = new HashSet<Note>();
        }

        public long Id { get; set; }
        public long BusinessCategoryTypeId { get; set; }
        public string Name { get; set; }
        public string ActionKey { get; set; }
        public string Description { get; set; }
        public bool IsDefault { get; set; }
        public bool IsInternal { get; set; }

        public BusinessCategoryType BusinessCategoryType { get; set; }
        public ICollection<ApprovalEntityMapping> ApprovalEntityMappings { get; set; }
        public ICollection<ApproverGroup> ApproverGroups { get; set; }
        public ICollection<CustomFieldMaster> CustomFieldMasters { get; set; }
        public ICollection<CustomFieldValidation> CustomFieldValidations { get; set; }
        public ICollection<Note> Notes { get; set; }
        public ICollection<Server> ServerAuthenticationTypes { get; set; }
        public ICollection<Server> ServerProtocols { get; set; }
        public ICollection<Server> ServerSenderOptions { get; set; }
        public ICollection<Contact> Contacts { get; set; }
    }
}
