using Boooks.Net.Endpoint.Controllers;
using Microsoft.AspNetCore.Mvc;
using Project.Application.Service.Defination;
using Project.Core;
using Project.Object;
using Project.Object.Requests;
using Project.Object.Responses;
using System.Threading.Tasks;

namespace Project.Endpoint.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : BaseController
    {
        private readonly IProductService _productService;
        private readonly IApplicationContext _applicationContext;

        public ProductController(IProductService productService, IApplicationContext applicationContext)
        {
            _productService = productService;
            _applicationContext = applicationContext;
        }

        [HttpPost]
        [Route("add-product")]
        public async Task<ActionResult> AddProduct(ProductRequestModel product)
        {
            try
            {
                var response = new ResponseModel<ProductResponseModel>();
                var requestHeaders = await GetRequestHeadersAsync();

                _applicationContext.Log.LogInformation($"Going to execute _productService.AddProduct({product.Name})");
                var productResponse = await _productService.AddProduct(product);
                _applicationContext.Log.LogInformation($"Completed _productService.AddProduct({product.Name})");

                if (productResponse.Id != null)
                {
                    response.IsSuccess = true;
                    response.Data = productResponse;
                    return Ok(response);
                }
                else
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Product creation failed.";
                    return BadRequest(response);
                }
            }
            catch (Exception ex)
            {
                _applicationContext.Log.LogError(ex, "AddProducts - Exception");
                return StatusCode(500, new ResponseModel<ProductResponseModel>
                {
                    IsSuccess = false,
                    ErrorMessage = "An unexpected error occurred."
                });
            }
        }
    }
}
