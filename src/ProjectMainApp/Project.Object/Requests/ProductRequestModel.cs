namespace Project.Object.Requests
{
    public class ProductRequestModel
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public string Slug { get; set; }
        public decimal Price { get; set; }
        public int? Stock { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? DiscountStartDate { get; set; }
        public DateTime? DiscountEndDate { get; set; }
    }
} 