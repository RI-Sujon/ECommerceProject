using Boooks.Net.Endpoint.Controllers;
using Microsoft.AspNetCore.Mvc;
using Project.Application.Service.Defination;
using Project.Core;
using Project.Object;
using Project.Object.Requests;
using Project.Object.Responses;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Project.Endpoint.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : BaseController
    {
        private readonly ICartService _cartService;
        private readonly IApplicationContext _applicationContext;
        private readonly ILogger<CartController> _logger;

        public CartController(ICartService cartService, IApplicationContext applicationContext, ILogger<CartController> logger)
        {
            _cartService = cartService;
            _applicationContext = applicationContext;
            _logger = logger;
        }

        [HttpPost("add-item-to-cart")]
        public async Task<ActionResult> AddItemToCart(CartRequestModel request)
        {
            try
            {
                var response = new ResponseModel<CartResponseModel>();
                var requestHeaders = await GetRequestHeadersAsync();

                _applicationContext.Log.LogInformation($"Going to execute _cartService.AddItemToCart for ProductId: {request.ProductId}");
                var cartResponse = await _cartService.AddItemToCart(request, requestHeaders.UserId);
                _applicationContext.Log.LogInformation($"Completed _cartService.AddItemToCart for ProductId: {request.ProductId}");

                if (cartResponse != null)
                {
                    response.IsSuccess = true;
                    response.Data = cartResponse;
                    return Ok(response);
                }
                else
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Failed to add item to cart.";
                    return BadRequest(response);
                }
            }
            catch (Exception ex)
            {
                _applicationContext.Log.LogError(ex, "AddItemToCart - Exception");
                return StatusCode(500, new ResponseModel<CartResponseModel>
                {
                    IsSuccess = false,
                    ErrorMessage = "An unexpected error occurred."
                });
            }
        }

        [HttpGet("get-cart")]
        public async Task<ActionResult> GetCart()
        {
            try
            {
                var response = new ResponseModel<List<CartResponseModel>>();
                var requestHeaders = await GetRequestHeadersAsync();

                _applicationContext.Log.LogInformation("Going to execute _cartService.GetCart");
                var cartItems = await _cartService.GetCart(requestHeaders.UserId);
                _applicationContext.Log.LogInformation("Completed _cartService.GetCart");

                if (cartItems != null)
                {
                    response.IsSuccess = true;
                    response.Data = cartItems;
                    return Ok(response);
                }
                else
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Failed to get cart items.";
                    return BadRequest(response);
                }
            }
            catch (Exception ex)
            {
                _applicationContext.Log.LogError(ex, "GetCart - Exception");
                return StatusCode(500, new ResponseModel<List<CartResponseModel>>
                {
                    IsSuccess = false,
                    ErrorMessage = "An unexpected error occurred."
                });
            }
        }

        [HttpDelete("remove-item-from-cart/{cartItemId}")]
        public async Task<ActionResult> RemoveItemFromCart(int cartItemId)
        {
            try
            {
                var response = new ResponseModel<bool>();
                var requestHeaders = await GetRequestHeadersAsync();

                _applicationContext.Log.LogInformation($"Going to execute _cartService.RemoveItemFromCart for CartItemId: {cartItemId}");
                var result = await _cartService.RemoveItemFromCart(cartItemId, requestHeaders.UserId);
                _applicationContext.Log.LogInformation($"Completed _cartService.RemoveItemFromCart for CartItemId: {cartItemId}");

                if (result)
                {
                    response.IsSuccess = true;
                    response.Data = true;
                    return Ok(response);
                }
                else
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Failed to remove item from cart.";
                    return BadRequest(response);
                }
            }
            catch (Exception ex)
            {
                _applicationContext.Log.LogError(ex, "RemoveItemFromCart - Exception");
                return StatusCode(500, new ResponseModel<bool>
                {
                    IsSuccess = false,
                    ErrorMessage = "An unexpected error occurred."
                });
            }
        }

        [HttpPost("decrease-item-quantity")]
        public async Task<ActionResult> DecreaseItemQuantity(CartRequestModel request)
        {
            try
            {
                var response = new ResponseModel<CartResponseModel>();
                var requestHeaders = await GetRequestHeadersAsync();

                _applicationContext.Log.LogInformation($"Going to execute _cartService.DecreaseItemQuantity for ProductId: {request.ProductId}");
                var cartResponse = await _cartService.DecreaseItemQuantity(request, requestHeaders.UserId);
                _applicationContext.Log.LogInformation($"Completed _cartService.DecreaseItemQuantity for ProductId: {request.ProductId}");

                if (cartResponse != null)
                {
                    response.IsSuccess = true;
                    response.Data = cartResponse;
                    return Ok(response);
                }
                else
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Failed to decrease item quantity.";
                    return BadRequest(response);
                }
            }
            catch (Exception ex)
            {
                _applicationContext.Log.LogError(ex, "DecreaseItemQuantity - Exception");
                return StatusCode(500, new ResponseModel<CartResponseModel>
                {
                    IsSuccess = false,
                    ErrorMessage = "An unexpected error occurred."
                });
            }
        }
    }
}
