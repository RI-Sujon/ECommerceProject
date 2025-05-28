using Microsoft.Extensions.DependencyInjection;
using Project.Application.Provider.Product.Command;
using Project.Application.Provider.Product.Query;
using Project.Core;
using Project.Object.Requests;
using Project.Object.Responses;

namespace Project.Application.Provider.Product
{
    public class ProductProvider : IProductProvider
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IApplicationContext _applicationContext;

        public ProductProvider(IApplicationContext applicationContext, IServiceProvider serviceProvider)
        {
            _applicationContext = applicationContext;
            _serviceProvider = serviceProvider;
        }

        public async Task<ProductResponseModel> AddProduct(ProductRequestModel product)
        {
            var addProductCommand = _serviceProvider.GetRequiredService<AddProductCommand>();

            _applicationContext.Log.LogInformation($"Going to execute addProductCommand.AddProduct({product.Name})");
            var result = await addProductCommand.AddProduct(product);
            _applicationContext.Log.LogInformation($"Completed addProductCommand.AddProduct({product.Name})");

            return result;
        }

        public async Task<GetProductListResponse> GetProductList(GetProductListRequest request)
        {
            var getProductListQuery = _serviceProvider.GetRequiredService<GetProductListQuery>();

            _applicationContext.Log.LogInformation("Going to execute GetProductList in provider");
            var response = await getProductListQuery.GetProductList(request);
            _applicationContext.Log.LogInformation("Completed GetProductList in provider");
            return response;
        }
    }
}
