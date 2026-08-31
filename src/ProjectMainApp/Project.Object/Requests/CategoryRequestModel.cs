using System.ComponentModel.DataAnnotations;

namespace Project.Object.Requests
{
    public class CategoryRequestModel
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Slug { get; set; } = string.Empty;

        public int? ParentId { get; set; }
    }
}
