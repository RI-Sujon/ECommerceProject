using System.ComponentModel.DataAnnotations;

namespace Project.Object
{
    public class PaginationModelBase 
    {
        [Range(1, int.MaxValue)]
        public int? Page { get; set; }
        [Range(1, int.MaxValue)]
        public int? PageSize { get; set; }
    }

    public class PaginationWithCountModelBase : PaginationModelBase
    {
        public bool? IsCountCalled { get; set; }
    }
}
