namespace Project.Object.Entities
{
    public class CategoryEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public int? ParentId { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
