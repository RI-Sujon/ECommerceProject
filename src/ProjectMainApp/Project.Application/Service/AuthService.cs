using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Project.Application.Service.Defination;
using Project.Object.Entities;
using Project.Object.Requests;
using Project.Object.Responses;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Project.Application.Service
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        public async Task<AuthResponse> Register(RegisterRequest request)
        {
            var exists = await _dbContext.Users
                .AnyAsync(u => u.Email == request.Email.ToLower());

            if (exists)
                throw new ArgumentException("A user with this email already exists.");

            var user = new UserEntity
            {
                Email = request.Email.ToLower(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                FullName = request.FullName,
                Role = "Customer",
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return BuildToken(user);
        }

        public async Task<AuthResponse> Login(LoginRequest request)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email.ToLower());

            if (user == null)
                throw new UnauthorizedAccessException("Invalid email or password.");

            if (user.LockedUntil.HasValue && user.LockedUntil.Value > DateTime.UtcNow)
                throw new UnauthorizedAccessException(
                    $"Account is locked due to multiple failed attempts. Try again after {user.LockedUntil.Value:HH:mm} UTC.");

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                user.FailedLoginAttempts++;
                if (user.FailedLoginAttempts >= 5)
                    user.LockedUntil = DateTime.UtcNow.AddMinutes(15);
                await _dbContext.SaveChangesAsync();
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

            // Successful login — reset lockout counters
            user.FailedLoginAttempts = 0;
            user.LockedUntil = null;
            await _dbContext.SaveChangesAsync();

            return BuildToken(user);
        }

        private AuthResponse BuildToken(UserEntity user)
        {
            var key = _configuration["Jwt:Key"]!;
            var issuer = _configuration["Jwt:Issuer"]!;
            var audience = _configuration["Jwt:Audience"]!;
            var expiryMinutes = int.Parse(_configuration["Jwt:ExpiryMinutes"] ?? "60");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var expiry = DateTime.UtcNow.AddMinutes(expiryMinutes);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("fullName", user.FullName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: expiry,
                signingCredentials: credentials);

            return new AuthResponse
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                ExpiresAt = expiry
            };
        }
    }
}
