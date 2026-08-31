using Microsoft.EntityFrameworkCore;
using Project.Core;
using Project.Object.Requests;
using Project.Object.Responses;

namespace Project.Application.Provider.Product.Command
{
    public class UpdateProductCommand
    {
        private readonly IApplicationContext _applicationContext;
        private readonly AppDbContext _dbContext;

        public UpdateProductCommand(IApplicationContext applicationContext, AppDbContext dbContext)
        {
            _applicationContext = applicationContext;
            _dbContext = dbContext;
        }

        public async Task<ProductResponseModel> UpdateProduct(int id, ProductRequestModel request)
        {
            var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                throw new KeyNotFoundException($"Product with ID {id} not found.");

            product.Name = request.Name;
            product.Description = request.Description ?? product.Description;
            product.Slug = request.Slug;
            product.Price = request.Price;
            product.Stock = request.Stock ?? product.Stock;
            product.IsActive = request.IsActive ?? product.IsActive;
            product.DiscountStartDate = request.DiscountStartDate;
            product.DiscountEndDate = request.DiscountEndDate;

            await _dbContext.SaveChangesAsync();

            return new ProductResponseModel
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Slug = product.Slug,
                Price = product.Price,
                Stock = product.Stock,
                IsActive = product.IsActive,
                DiscountStartDate = product.DiscountStartDate,
                DiscountEndDate = product.DiscountEndDate
            };
        }
    }
}
