using Microsoft.EntityFrameworkCore;
using Project.Application.Service.Defination;
using Project.Object.Entities;
using Project.Object.Requests;
using Project.Object.Responses;

namespace Project.Application.Service
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _dbContext;

        public UserService(AppDbContext dbContext) => _dbContext = dbContext;

        public async Task<UserProfileResponse> GetProfile(int userId)
        {
            var user = await _dbContext.Users.FindAsync(userId)
                ?? throw new KeyNotFoundException("User not found.");

            var stats = await _dbContext.Orders
                .Where(o => o.UserId == userId && o.Status != "Cancelled")
                .GroupBy(o => o.UserId)
                .Select(g => new { Count = g.Count(), Total = g.Sum(o => o.TotalAmount) })
                .FirstOrDefaultAsync();

            return Map(user, stats?.Count ?? 0, stats?.Total ?? 0m);
        }

        public async Task<UserProfileResponse> UpdateProfile(int userId, UpdateProfileRequest request)
        {
            var user = await _dbContext.Users.FindAsync(userId)
                ?? throw new KeyNotFoundException("User not found.");

            user.FullName = request.FullName;

            if (!string.IsNullOrWhiteSpace(request.NewPassword))
            {
                if (string.IsNullOrWhiteSpace(request.CurrentPassword))
                    throw new ArgumentException("Current password is required to change password.");

                if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
                    throw new UnauthorizedAccessException("Current password is incorrect.");

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            }

            await _dbContext.SaveChangesAsync();
            return Map(user, 0, 0);
        }

        private static UserProfileResponse Map(UserEntity user, int orderCount, decimal totalSpent) => new()
        {
            Id         = user.Id,
            Email      = user.Email,
            FullName   = user.FullName,
            Role       = user.Role,
            CreatedAt  = user.CreatedAt,
            OrderCount = orderCount,
            TotalSpent = totalSpent
        };
    }
}
