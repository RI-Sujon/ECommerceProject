using Microsoft.EntityFrameworkCore;
using Project.Application.Service.Defination;
using Project.Object.Entities;
using Project.Object.Responses;

namespace Project.Application.Service
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _dbContext;

        public OrderService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<OrderResponse> Checkout(int userId)
        {
            // Load cart with product details
            var cartItems = await _dbContext.Carts
                .Where(c => c.UserId == userId)
                .Join(_dbContext.Products,
                    cart => cart.ProductId,
                    product => product.Id,
                    (cart, product) => new { cart, product })
                .ToListAsync();

            if (!cartItems.Any())
                throw new ArgumentException("Cart is empty. Add items before checking out.");

            // Validate stock for all items
            foreach (var item in cartItems)
            {
                if (item.product.Stock < item.cart.Quantity)
                    throw new ArgumentException(
                        $"Insufficient stock for '{item.product.Name}'. Available: {item.product.Stock}, Requested: {item.cart.Quantity}.");
            }

            var now = DateTime.UtcNow;

            // Create order
            var order = new OrderEntity
            {
                UserId = userId,
                Status = "Pending",
                TotalAmount = cartItems.Sum(i =>
                {
                    var isDiscounted = i.product.DiscountStartDate.HasValue &&
                                       i.product.DiscountEndDate.HasValue &&
                                       i.product.DiscountStartDate.Value <= now &&
                                       i.product.DiscountEndDate.Value >= now;
                    var unitPrice = isDiscounted ? i.product.Price * 0.75m : i.product.Price;
                    return unitPrice * i.cart.Quantity;
                }),
                CreatedAt = now
            };

            _dbContext.Orders.Add(order);
            await _dbContext.SaveChangesAsync();

            // Create order items and decrement stock
            var orderItems = new List<OrderItemEntity>();
            foreach (var item in cartItems)
            {
                var isDiscounted = item.product.DiscountStartDate.HasValue &&
                                   item.product.DiscountEndDate.HasValue &&
                                   item.product.DiscountStartDate.Value <= now &&
                                   item.product.DiscountEndDate.Value >= now;
                var unitPrice = isDiscounted ? item.product.Price * 0.75m : item.product.Price;

                orderItems.Add(new OrderItemEntity
                {
                    OrderId = order.Id,
                    ProductId = item.cart.ProductId,
                    ProductName = item.product.Name,
                    UnitPrice = unitPrice,
                    Quantity = item.cart.Quantity
                });

                item.product.Stock -= item.cart.Quantity;
            }

            _dbContext.OrderItems.AddRange(orderItems);

            // Clear cart
            _dbContext.Carts.RemoveRange(
                cartItems.Select(i => i.cart));

            await _dbContext.SaveChangesAsync();

            return MapToResponse(order, orderItems);
        }

        public async Task<GetOrderHistoryResponse> GetOrderHistory(int userId, int page, int pageSize, string? statusFilter = null)
        {
            var query = _dbContext.Orders.Where(o => o.UserId == userId);
            if (!string.IsNullOrWhiteSpace(statusFilter))
                query = query.Where(o => o.Status == statusFilter);

            var totalCount = await query.CountAsync();

            var orders = await query
                .OrderByDescending(o => o.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var orderIds = orders.Select(o => o.Id).ToList();
            var allItems = await _dbContext.OrderItems
                .Where(oi => orderIds.Contains(oi.OrderId))
                .ToListAsync();

            return new GetOrderHistoryResponse
            {
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                Orders = orders.Select(o => MapToResponse(o,
                    allItems.Where(oi => oi.OrderId == o.Id).ToList())).ToList()
            };
        }

        public async Task UpdateOrderStatus(int orderId, string newStatus)
        {
            var validStatuses = new[] { "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled" };
            if (!validStatuses.Contains(newStatus))
                throw new ArgumentException(
                    $"Invalid status '{newStatus}'. Must be one of: {string.Join(", ", validStatuses)}.");

            var order = await _dbContext.Orders.FirstOrDefaultAsync(o => o.Id == orderId);
            if (order == null)
                throw new KeyNotFoundException($"Order {orderId} not found.");

            order.Status = newStatus;
            order.UpdatedAt = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
        }

        public async Task<OrderResponse> GetOrderById(int orderId, int userId)
        {
            var order = await _dbContext.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

            if (order == null)
                throw new KeyNotFoundException($"Order {orderId} not found.");

            var items = await _dbContext.OrderItems
                .Where(oi => oi.OrderId == orderId)
                .ToListAsync();

            return MapToResponse(order, items);
        }

        private static OrderResponse MapToResponse(OrderEntity order, IEnumerable<OrderItemEntity> items)
        {
            return new OrderResponse
            {
                Id = order.Id,
                UserId = order.UserId,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt,
                Items = items.Select(i => new OrderItemResponse
                {
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    UnitPrice = i.UnitPrice,
                    Quantity = i.Quantity
                }).ToList()
            };
        }

        public async Task CancelOrder(int orderId, int userId)
        {
            var order = await _dbContext.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId)
                ?? throw new KeyNotFoundException($"Order {orderId} not found.");

            if (order.Status != "Pending")
                throw new InvalidOperationException("Only Pending orders can be cancelled.");

            // Restore stock
            var items = await _dbContext.OrderItems.Where(i => i.OrderId == orderId).ToListAsync();
            foreach (var item in items)
            {
                var product = await _dbContext.Products.FindAsync(item.ProductId);
                if (product != null) product.Stock += item.Quantity;
            }

            order.Status    = "Cancelled";
            order.UpdatedAt = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
        }
    }
}
