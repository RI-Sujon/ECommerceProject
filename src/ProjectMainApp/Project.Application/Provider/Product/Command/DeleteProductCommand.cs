using Microsoft.EntityFrameworkCore;
using Project.Core;

namespace Project.Application.Provider.Product.Command
{
    public class DeleteProductCommand
    {
        private readonly IApplicationContext _applicationContext;
        private readonly AppDbContext _dbContext;

        public DeleteProductCommand(IApplicationContext applicationContext, AppDbContext dbContext)
        {
            _applicationContext = applicationContext;
            _dbContext = dbContext;
        }

        public async Task DeleteProduct(int id)
        {
            var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                throw new KeyNotFoundException($"Product with ID {id} not found.");

            // Soft delete — keeps data integrity with existing cart items
            product.IsActive = false;
            await _dbContext.SaveChangesAsync();
        }
    }
}
