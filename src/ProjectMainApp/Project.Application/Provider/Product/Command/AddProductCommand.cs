
using System.Data;
using Project.Core;
using Microsoft.Extensions.DependencyInjection;
using Project.Object.Responses;
using Project.Object.Requests;
using Project.Object.Entities;

namespace Project.Application.Data.Command;

public class AddProductCommand 
{
    private readonly IApplicationContext _applicationContext;
    private readonly AppDbContext _dbContext;

    public AddProductCommand(IApplicationContext applicationContext, AppDbContext dbContext)
    {
        _applicationContext = applicationContext;
        _dbContext = dbContext;
    }
    public async Task<ProductResponseModel> AddProduct(ProductRequestModel product)
    {
        _applicationContext.Log.LogInformation("Going to execute - AddProductCommand");

        var addProduct = new Product()
        {
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Stock = product.Stock
        };

        _dbContext.Products.Add(addProduct);
        await _dbContext.SaveChangesAsync();

        return new ProductResponseModel
        {
            Id = addProduct.Id,
            Name = addProduct.Name,
            Description = addProduct.Description,
            Price = addProduct.Price,
            Stock = addProduct.Stock
        };
    }
}