using System.ComponentModel.DataAnnotations;

namespace Project.Object.Requests
{
    public class CartRequestModel
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "ProductId must be a positive integer.")]
        public int ProductId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }
    }
} 