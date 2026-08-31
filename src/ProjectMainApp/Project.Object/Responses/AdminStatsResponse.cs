namespace Project.Object.Responses
{
    public class AdminStatsResponse
    {
        public int TotalProducts { get; set; }
        public int TotalOrders { get; set; }
        public int TotalUsers { get; set; }
        public decimal TotalRevenue { get; set; }
        public List<LowStockProductDto> LowStockProducts { get; set; } = new();
        public List<OrderSummaryDto> RecentOrders { get; set; } = new();
    }

    public class LowStockProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Stock { get; set; }
        public decimal Price { get; set; }
    }

    public class OrderSummaryDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
