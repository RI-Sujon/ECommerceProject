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
    public class OrderController : BaseController
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("checkout")]
        public async Task<ActionResult> Checkout()
        {
            var headers = await GetRequestHeadersAsync();
            var result = await _orderService.Checkout(headers.UserId);
            return Ok(new ResponseModel<OrderResponse> { IsSuccess = true, Data = result });
        }

        [HttpGet]
        public async Task<ActionResult> GetOrderHistory(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 5,
            [FromQuery] string? status = null)
        {
            var headers = await GetRequestHeadersAsync();
            var result = await _orderService.GetOrderHistory(headers.UserId, page, pageSize, status);
            return Ok(new ResponseModel<GetOrderHistoryResponse> { IsSuccess = true, Data = result });
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult> GetOrderById(int id)
        {
            var headers = await GetRequestHeadersAsync();
            var result = await _orderService.GetOrderById(id, headers.UserId);
            return Ok(new ResponseModel<OrderResponse> { IsSuccess = true, Data = result });
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id:int}/status")]
        public async Task<ActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusRequest request)
        {
            await _orderService.UpdateOrderStatus(id, request.Status);
            return Ok(new ResponseModel<object> { IsSuccess = true });
        }

        [Authorize]
        [HttpPost("{id:int}/cancel")]
        public async Task<ActionResult> CancelOrder(int id)
        {
            var headers = await GetRequestHeadersAsync();
            await _orderService.CancelOrder(id, headers.UserId);
            return Ok(new ResponseModel<object> { IsSuccess = true });
        }
    }
}
