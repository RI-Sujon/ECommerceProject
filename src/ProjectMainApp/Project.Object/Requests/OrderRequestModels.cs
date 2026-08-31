using System.ComponentModel.DataAnnotations;

namespace Project.Object.Requests
{
    public class UpdateOrderStatusRequest
    {
        [Required]
        public string Status { get; set; } = string.Empty;
    }
}
