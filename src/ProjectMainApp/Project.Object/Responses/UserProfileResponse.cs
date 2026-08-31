namespace Project.Object.Responses
{
    public class UserProfileResponse
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int OrderCount { get; set; }
        public decimal TotalSpent { get; set; }
    }
}
