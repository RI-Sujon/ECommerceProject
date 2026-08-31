namespace Project.Object.Responses
{
    public class GetOrderHistoryResponse
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public List<OrderResponse> Orders { get; set; } = new();
    }

    public class OrderItemResponse
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal LineTotal => UnitPrice * Quantity;
    }

    public class OrderResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? UserEmail { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<OrderItemResponse> Items { get; set; } = new();
    }
}
