using Project.Application.Provider.Cart;
using Project.Application.Service.Defination;
using Project.Object;
using Project.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Project.Object.Responses;
using Project.Object.Requests;

namespace Project.Application.Service
{
    public class ProductService : IProductService
    {
        private readonly IProductProvider _productProvider;
        private readonly IApplicationContext _applicationContext;

        public ProductService(IApplicationContext applicationContext, IProductProvider productProvider)
        {
            _productProvider = productProvider;
            _applicationContext = applicationContext;
        }

        public async Task<ProductResponseModel> AddProduct(ProductRequestModel product)
        {
            _applicationContext.Log.LogInformation($"Going to execute _productProvider.AddProduct({product.Name})");
            var result = await _productProvider.AddProduct(product);
            _applicationContext.Log.LogInformation($"Completed _productProvider.AddProduct({product.Name})");
            return result;
        }
    }
}
