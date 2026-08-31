namespace Project.Object.Entities
{
    public class OrderEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Status { get; set; } = "Pending"; // Pending | Confirmed | Shipped | Delivered | Cancelled
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
