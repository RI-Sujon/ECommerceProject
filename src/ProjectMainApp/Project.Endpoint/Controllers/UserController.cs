using Boooks.Net.Endpoint.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project.Application.Service.Defination;
using Project.Object;
using Project.Object.Requests;
using Project.Object.Responses;

namespace Project.Endpoint.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : BaseController
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("profile")]
        public async Task<ActionResult> GetProfile()
        {
            var headers = await GetRequestHeadersAsync();
            var result = await _userService.GetProfile(headers.UserId);
            return Ok(new ResponseModel<UserProfileResponse> { IsSuccess = true, Data = result });
        }

        [HttpPut("profile")]
        public async Task<ActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var headers = await GetRequestHeadersAsync();
            var result = await _userService.UpdateProfile(headers.UserId, request);
            return Ok(new ResponseModel<UserProfileResponse> { IsSuccess = true, Data = result });
        }
    }
}
