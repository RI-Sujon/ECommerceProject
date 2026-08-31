using Boooks.Net.Endpoint.Controllers;
using Microsoft.AspNetCore.Authorization;
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
    public class ProductController : BaseController
    {
        private readonly IProductService _productService;
        private readonly IApplicationContext _applicationContext;

        public ProductController(IProductService productService, IApplicationContext applicationContext)
        {
            _productService = productService;
            _applicationContext = applicationContext;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("add-product")]
        public async Task<ActionResult> AddProduct(ProductRequestModel product)
        {
            _applicationContext.Log.LogInformation($"AddProduct: {product.Name}");
            var result = await _productService.AddProduct(product);
            return Ok(new ResponseModel<ProductResponseModel> { IsSuccess = true, Data = result });
        }

        [HttpGet("get-product-list")]
        public async Task<ActionResult> GetProductList([FromQuery] GetProductListRequest request)
        {
            _applicationContext.Log.LogInformation("GetProductList");
            var result = await _productService.GetProductList(request);
            return Ok(new ResponseModel<GetProductListResponse> { IsSuccess = true, Data = result });
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult> GetProductById(int id)
        {
            _applicationContext.Log.LogInformation($"GetProductById: {id}");
            var result = await _productService.GetProductById(id);
            return Ok(new ResponseModel<ProductResponseModel> { IsSuccess = true, Data = result });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<ActionResult> UpdateProduct(int id, ProductRequestModel product)
        {
            _applicationContext.Log.LogInformation($"UpdateProduct: {id}");
            var result = await _productService.UpdateProduct(id, product);
            return Ok(new ResponseModel<ProductResponseModel> { IsSuccess = true, Data = result });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            _applicationContext.Log.LogInformation($"DeleteProduct: {id}");
            await _productService.DeleteProduct(id);
            return Ok(new ResponseModel<object> { IsSuccess = true });
        }
    }
}
