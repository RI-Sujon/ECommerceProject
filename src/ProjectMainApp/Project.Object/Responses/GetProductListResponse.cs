using Project.Object;

namespace Project.Object.Responses
{
    public class GetProductListResponse : PaginationModelBase
    {
        public List<ProductResponseModel> Products { get; set; } = new();
        public int TotalCount { get; set; }
    }
} 