namespace Project.Object.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public int CategoryId { get; set; }
        public bool IsActive { get; set; }
        public object CreatedAt { get; set; }
        public object UpdatedAt { get; set; }
    }
} 