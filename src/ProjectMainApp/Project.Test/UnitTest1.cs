using Microsoft.EntityFrameworkCore;
using Project.Application.Provider.Cart.Command;
using Project.Application.Provider.Cart.Query;
using Project.Application.Service;
using Project.Core;
using Project.Core.Caching;
using Project.Core.Log;
using Project.Object.Entities;
using Project.Object.Requests;

namespace Project.Test
{
    public class CartTests
    {
        private static AppDbContext CreateDb()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        private static IApplicationContext CreateContext() =>
            new ApplicationContext(new InMemoryCacheProvider(), new DummyLogger());

        // ── AddItemToCart ────────────────────────────────────────────────────

        [Fact]
        public async Task AddItemToCart_NewItem_CreatesCartEntry()
        {
            var db = CreateDb();
            db.Products.Add(new ProductEntity { Id = 1, Name = "Widget", Price = 10m, Stock = 50, IsActive = true, Slug = "widget", Description = "" });
            await db.SaveChangesAsync();

            var cmd = new AddItemToCartCommand(CreateContext(), db);
            var result = await cmd.AddItemToCart(new CartRequestModel { ProductId = 1, Quantity = 2 }, userId: 42);

            Assert.NotNull(result);
            Assert.Equal(42, result.UserId);
            Assert.Equal(2, result.Quantity);
            Assert.Equal(20m, result.TotalPrice);
        }

        [Fact]
        public async Task AddItemToCart_ExistingItem_IncreasesQuantity()
        {
            var db = CreateDb();
            db.Products.Add(new ProductEntity { Id = 1, Name = "Widget", Price = 10m, Stock = 50, IsActive = true, Slug = "widget", Description = "" });
            db.Carts.Add(new CartEntity { UserId = 42, ProductId = 1, Quantity = 1, CreatedAt = DateTime.UtcNow });
            await db.SaveChangesAsync();

            var cmd = new AddItemToCartCommand(CreateContext(), db);
            var result = await cmd.AddItemToCart(new CartRequestModel { ProductId = 1, Quantity = 3 }, userId: 42);

            Assert.Equal(4, result.Quantity);
        }

        [Fact]
        public async Task AddItemToCart_ProductNotFound_Throws()
        {
            var db = CreateDb();
            var cmd = new AddItemToCartCommand(CreateContext(), db);

            await Assert.ThrowsAsync<Exception>(() =>
                cmd.AddItemToCart(new CartRequestModel { ProductId = 99, Quantity = 1 }, userId: 1));
        }

        // ── GetCart ──────────────────────────────────────────────────────────

        [Fact]
        public async Task GetCart_ReturnsOnlyUserItems()
        {
            var db = CreateDb();
            db.Products.Add(new ProductEntity { Id = 1, Name = "A", Price = 5m, Stock = 10, IsActive = true, Slug = "a", Description = "" });
            db.Carts.Add(new CartEntity { UserId = 1, ProductId = 1, Quantity = 2, CreatedAt = DateTime.UtcNow });
            db.Carts.Add(new CartEntity { UserId = 2, ProductId = 1, Quantity = 5, CreatedAt = DateTime.UtcNow });
            await db.SaveChangesAsync();

            var query = new GetCartQuery(CreateContext(), db);
            var cart = await query.GetCart(userId: 1);

            Assert.Single(cart);
            Assert.Equal(1, cart[0].UserId);
        }

        // ── DecreaseItemQuantity ─────────────────────────────────────────────

        [Fact]
        public async Task DecreaseItemQuantity_QuantityHitsZero_RemovesItem()
        {
            var db = CreateDb();
            db.Products.Add(new ProductEntity { Id = 1, Name = "A", Price = 5m, Stock = 10, IsActive = true, Slug = "a", Description = "" });
            db.Carts.Add(new CartEntity { UserId = 1, ProductId = 1, Quantity = 1, CreatedAt = DateTime.UtcNow });
            await db.SaveChangesAsync();

            var cmd = new DecreaseItemQuantityCommand(CreateContext(), db);
            var result = await cmd.DecreaseItemQuantity(new CartRequestModel { ProductId = 1, Quantity = 1 }, userId: 1);

            Assert.Null(result);
            Assert.Empty(db.Carts.ToList());
        }

        // ── OrderService checkout ────────────────────────────────────────────

        [Fact]
        public async Task Checkout_EmptyCart_Throws()
        {
            var db = CreateDb();
            var service = new OrderService(db);

            await Assert.ThrowsAsync<ArgumentException>(() => service.Checkout(userId: 1));
        }

        [Fact]
        public async Task Checkout_InsufficientStock_Throws()
        {
            var db = CreateDb();
            db.Products.Add(new ProductEntity { Id = 1, Name = "Low", Price = 10m, Stock = 1, IsActive = true, Slug = "low", Description = "" });
            db.Carts.Add(new CartEntity { UserId = 1, ProductId = 1, Quantity = 5, CreatedAt = DateTime.UtcNow });
            await db.SaveChangesAsync();

            var service = new OrderService(db);
            await Assert.ThrowsAsync<ArgumentException>(() => service.Checkout(userId: 1));
        }

        [Fact]
        public async Task Checkout_ValidCart_CreatesOrderAndClearsCart()
        {
            var db = CreateDb();
            db.Products.Add(new ProductEntity { Id = 1, Name = "Item", Price = 20m, Stock = 10, IsActive = true, Slug = "item", Description = "" });
            db.Carts.Add(new CartEntity { UserId = 1, ProductId = 1, Quantity = 2, CreatedAt = DateTime.UtcNow });
            await db.SaveChangesAsync();

            var service = new OrderService(db);
            var order = await service.Checkout(userId: 1);

            Assert.Equal(40m, order.TotalAmount);
            Assert.Equal(2, order.Items[0].Quantity);
            Assert.Empty(db.Carts.ToList());

            // Stock decremented
            var product = await db.Products.FindAsync(1);
            Assert.Equal(8, product!.Stock);
        }
    }
}
