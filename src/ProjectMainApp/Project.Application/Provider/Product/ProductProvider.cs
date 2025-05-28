using Microsoft.Extensions.DependencyInjection;
using Project.Application.Data.Command;
using Project.Core;
using Project.Object.Requests;
using Project.Object.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project.Application.Provider.Cart
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
    }
}
