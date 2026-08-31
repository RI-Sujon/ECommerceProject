using Project.Object;

namespace Project.Object.Requests
{
    public class GetProductListRequest : PaginationModelBase
    {
        public string? SearchText { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public bool? IsActive { get; set; }
        public int? CategoryId { get; set; }
        /// <summary>price_asc | price_desc | name_asc | name_desc | newest (default)</summary>
        public string? SortBy { get; set; }
    }
} 