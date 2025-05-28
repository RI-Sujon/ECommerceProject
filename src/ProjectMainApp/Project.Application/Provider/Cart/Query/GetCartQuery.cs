using Microsoft.EntityFrameworkCore;
using Project.Core;
using Project.Object.Responses;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project.Application.Provider.Cart.Query
{
    public class GetCartQuery
    {
        private readonly IApplicationContext _applicationContext;
        private readonly AppDbContext _dbContext;

        public GetCartQuery(IApplicationContext applicationContext, AppDbContext dbContext)
        {
            _applicationContext = applicationContext;
            _dbContext = dbContext;
        }

        public async Task<List<CartResponseModel>> GetCart(int userId)
        {
            var cartItems = await _dbContext.Carts
                .Where(c => c.UserId == userId)
                .Join(_dbContext.Products,
                    cart => cart.ProductId,
                    product => product.Id,
                    (cart, product) => new CartResponseModel
                    {
                        Id = cart.Id,
                        UserId = cart.UserId,
                        ProductId = cart.ProductId,
                        ProductName = product.Name,
                        ProductPrice = product.Price,
                        Quantity = cart.Quantity,
                        TotalPrice = product.Price * cart.Quantity,
                        CreatedAt = cart.CreatedAt,
                        UpdatedAt = cart.UpdatedAt
                    })
                .ToListAsync();

            return cartItems;
        }
    }
} 