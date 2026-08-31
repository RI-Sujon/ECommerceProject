using Microsoft.EntityFrameworkCore;
using Project.Core;
using Project.Object.Responses;

namespace Project.Application.Provider.Product.Query
{
    public class GetProductByIdQuery
    {
        private readonly IApplicationContext _applicationContext;
        private readonly AppDbContext _dbContext;

        public GetProductByIdQuery(IApplicationContext applicationContext, AppDbContext dbContext)
        {
            _applicationContext = applicationContext;
            _dbContext = dbContext;
        }

        public async Task<ProductResponseModel> GetProductById(int id)
        {
            var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                throw new KeyNotFoundException($"Product with ID {id} not found.");

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
