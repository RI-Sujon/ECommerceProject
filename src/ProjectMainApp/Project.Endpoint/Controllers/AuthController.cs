using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Project.Application.Service.Defination;
using Project.Object;
using Project.Object.Requests;
using Project.Object.Responses;

namespace Project.Endpoint.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableRateLimiting("auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterRequest request)
        {
            var result = await _authService.Register(request);
            return Ok(new ResponseModel<AuthResponse> { IsSuccess = true, Data = result });
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginRequest request)
        {
            var result = await _authService.Login(request);
            return Ok(new ResponseModel<AuthResponse> { IsSuccess = true, Data = result });
        }
    }
}
