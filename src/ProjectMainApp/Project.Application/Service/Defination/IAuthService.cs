using Project.Object.Requests;
using Project.Object.Responses;

namespace Project.Application.Service.Defination
{
    public interface IAuthService
    {
        Task<AuthResponse> Register(RegisterRequest request);
        Task<AuthResponse> Login(LoginRequest request);
    }
}
