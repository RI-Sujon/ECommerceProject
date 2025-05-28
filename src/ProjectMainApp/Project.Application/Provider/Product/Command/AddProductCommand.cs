using System.Data;
using Project.Core;
using Microsoft.Extensions.DependencyInjection;
using Project.Object.Responses;
using Project.Object.Requests;
using Project.Object.Entities;

namespace Project.Application.Provider.Product.Command;

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
        
        var addProduct = new ProductEntity()
        {
            Name = product.Name,
            Description = product.Description,
            Slug = product.Slug,
            Price = product.Price,
            Stock = product.Stock,
            IsActive = product.IsActive,
            DiscountStartDate = product.DiscountStartDate,
            DiscountEndDate = product.DiscountEndDate
        };

        _dbContext.Products.Add(addProduct);
        await _dbContext.SaveChangesAsync();

        return new ProductResponseModel
        {
            Id = addProduct.Id,
            Name = addProduct.Name,
            Description = addProduct.Description,
            Slug = addProduct.Slug,
            Price = addProduct.Price,
            Stock = addProduct.Stock,
            IsActive = addProduct.IsActive,
            DiscountStartDate = addProduct.DiscountStartDate,
            DiscountEndDate = addProduct.DiscountEndDate
        };
    }
}