using Project.Core;
using Project.Object.Entities;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Project.Application.Provider.Cart.Command
{
    public class RemoveItemFromCartCommand
    {
        private readonly IApplicationContext _applicationContext;
        private readonly AppDbContext _dbContext;

        public RemoveItemFromCartCommand(IApplicationContext applicationContext, AppDbContext dbContext)
        {
            _applicationContext = applicationContext;
            _dbContext = dbContext;
        }

        public async Task<bool> RemoveItemFromCart(int cartItemId, int userId)
        {
            _applicationContext.Log.LogInformation($"Going to execute - RemoveItemFromCartCommand for CartItemId: {cartItemId}");

            var cartItem = await _dbContext.Carts
                .FirstOrDefaultAsync(c => c.Id == cartItemId && c.UserId == userId);

            if (cartItem == null)
            {
                _applicationContext.Log.LogInformation($"Cart item with ID {cartItemId} not found for user {userId}");
                return false;
            }

            _dbContext.Carts.Remove(cartItem);
            await _dbContext.SaveChangesAsync();

            _applicationContext.Log.LogInformation($"Successfully removed cart item with ID {cartItemId}");
            return true;
        }
    }
} 