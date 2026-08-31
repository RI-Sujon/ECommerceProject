using Boooks.Net.Endpoint.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project.Application.Service.Defination;
using Project.Object;
using Project.Object.Responses;

namespace Project.Endpoint.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : BaseController
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("stats")]
        public async Task<ActionResult> GetStats()
        {
            var result = await _adminService.GetStats();
            return Ok(new ResponseModel<AdminStatsResponse> { IsSuccess = true, Data = result });
        }

        [HttpGet("orders")]
        public async Task<ActionResult> GetAllOrders(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? status = null)
        {
            var result = await _adminService.GetAllOrders(page, pageSize, status);
            return Ok(new ResponseModel<GetOrderHistoryResponse> { IsSuccess = true, Data = result });
        }
    }
}
