using System;
using System.Collections.Generic;

namespace Itm.Data.Models
{
    public partial class ApplicationPageFieldDetail
    {
        public long Id { get; set; }
        public long PageId { get; set; }
        public string Name { get; set; }
        public string Caption { get; set; }
        public string CellTemplate { get; set; }
        public string DataType { get; set; }
        public string Format { get; set; }
        public bool? Visible { get; set; }
        public bool? ReadOnly { get; set; }
        public bool Required { get; set; }
        public bool IsUnique { get; set; }
        public bool? ColumnFilterEnabled { get; set; }
        public bool? RowFilterEnabled { get; set; }
        public bool? SortEnabled { get; set; }
        public string DefaultSortOrder { get; set; }
        public string Alignment { get; set; }
        public int RowNo { get; set; }

        public ApplicationPage Page { get; set; }
    }
}
