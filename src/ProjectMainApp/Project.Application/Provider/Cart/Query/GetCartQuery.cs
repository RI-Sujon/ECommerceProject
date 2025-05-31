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
            var now = DateTime.UtcNow;
            var cartItems = await _dbContext.Carts
                .Where(c => c.UserId == userId)
                .Join(_dbContext.Products,
                    cart => cart.ProductId,
                    product => product.Id,
                    (cart, product) => new
                    {
                        Cart = cart,
                        Product = product,
                        IsDiscounted = product.DiscountStartDate.HasValue && product.DiscountEndDate.HasValue
                            && product.DiscountStartDate.Value <= now && product.DiscountEndDate.Value >= now
                    })
                .Select(x => new CartResponseModel
                {
                    Id = x.Cart.Id,
                    UserId = x.Cart.UserId,
                    ProductId = x.Cart.ProductId,
                    ProductName = x.Product.Name,
                    ProductPrice = x.IsDiscounted ? x.Product.Price * 0.75m : x.Product.Price,
                    Quantity = x.Cart.Quantity,
                    TotalPrice = (x.IsDiscounted ? x.Product.Price * 0.75m : x.Product.Price) * x.Cart.Quantity,
                    CreatedAt = x.Cart.CreatedAt,
                    UpdatedAt = x.Cart.UpdatedAt
                })
                .ToListAsync();

            return cartItems;
        }
    }
} 