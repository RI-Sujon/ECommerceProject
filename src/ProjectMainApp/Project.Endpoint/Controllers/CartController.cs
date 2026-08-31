using Boooks.Net.Endpoint.Controllers;
using Microsoft.AspNetCore.Mvc;
using Project.Application.Service.Defination;
using Project.Core;
using Project.Object;
using Project.Object.Requests;
using Project.Object.Responses;

namespace Project.Endpoint.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : BaseController
    {
        private readonly ICartService _cartService;
        private readonly IApplicationContext _applicationContext;

        public CartController(ICartService cartService, IApplicationContext applicationContext)
        {
            _cartService = cartService;
            _applicationContext = applicationContext;
        }

        [HttpPost("add-item-to-cart")]
        public async Task<ActionResult> AddItemToCart(CartRequestModel request)
        {
            var requestHeaders = await GetRequestHeadersAsync();
            _applicationContext.Log.LogInformation($"AddItemToCart: ProductId={request.ProductId}");
            var result = await _cartService.AddItemToCart(request, requestHeaders.UserId);
            return Ok(new ResponseModel<CartResponseModel> { IsSuccess = true, Data = result });
        }

        [HttpGet("get-cart")]
        public async Task<ActionResult> GetCart()
        {
            var requestHeaders = await GetRequestHeadersAsync();
            _applicationContext.Log.LogInformation("GetCart");
            var result = await _cartService.GetCart(requestHeaders.UserId);
            return Ok(new ResponseModel<List<CartResponseModel>> { IsSuccess = true, Data = result });
        }

        [HttpDelete("remove-item-from-cart/{cartItemId}")]
        public async Task<ActionResult> RemoveItemFromCart(int cartItemId)
        {
            var requestHeaders = await GetRequestHeadersAsync();
            _applicationContext.Log.LogInformation($"RemoveItemFromCart: {cartItemId}");
            await _cartService.RemoveItemFromCart(cartItemId, requestHeaders.UserId);
            return Ok(new ResponseModel<object> { IsSuccess = true });
        }

        [HttpPost("decrease-item-quantity")]
        public async Task<ActionResult> DecreaseItemQuantity(CartRequestModel request)
        {
            var requestHeaders = await GetRequestHeadersAsync();
            _applicationContext.Log.LogInformation($"DecreaseItemQuantity: ProductId={request.ProductId}");
            // returns null when quantity hit 0 and item was removed ? both cases are success
            var result = await _cartService.DecreaseItemQuantity(request, requestHeaders.UserId);
            return Ok(new ResponseModel<CartResponseModel> { IsSuccess = true, Data = result });
        }
    }
}
