using Project.Object.Requests;
using Project.Object.Responses;

namespace Project.Application.Service.Defination
{
    public interface IUserService
    {
        Task<UserProfileResponse> GetProfile(int userId);
        Task<UserProfileResponse> UpdateProfile(int userId, UpdateProfileRequest request);
    }
}
