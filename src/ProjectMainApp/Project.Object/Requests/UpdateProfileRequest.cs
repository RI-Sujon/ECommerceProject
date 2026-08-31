using System.ComponentModel.DataAnnotations;

namespace Project.Object.Requests
{
    public class UpdateProfileRequest
    {
        [Required]
        [MaxLength(200)]
        public string FullName { get; set; } = string.Empty;

        public string? CurrentPassword { get; set; }

        [MinLength(8)]
        public string? NewPassword { get; set; }
    }
}
