using Microsoft.EntityFrameworkCore;
using Project.Application.Service.Defination;
using Project.Object.Responses;

namespace Project.Application.Service
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _dbContext;

        public AdminService(AppDbContext dbContext) => _dbContext = dbContext;

        public async Task<AdminStatsResponse> GetStats()
        {
            var totalProducts = await _dbContext.Products.CountAsync(p => p.IsActive);
            var totalOrders   = await _dbContext.Orders.CountAsync();
            var totalUsers    = await _dbContext.Users.CountAsync();
            var totalRevenue  = await _dbContext.Orders
                .Where(o => o.Status != "Cancelled")
                .SumAsync(o => (decimal?)o.TotalAmount) ?? 0m;

            var lowStock = await _dbContext.Products
                .Where(p => p.IsActive && p.Stock < 5)
                .OrderBy(p => p.Stock)
                .Select(p => new LowStockProductDto
                {
                    Id    = p.Id,
                    Name  = p.Name,
                    Stock = p.Stock,
                    Price = p.Price
                })
                .ToListAsync();

            var recentOrders = await _dbContext.Orders
                .OrderByDescending(o => o.CreatedAt)
                .Take(10)
                .Select(o => new OrderSummaryDto
                {
                    Id          = o.Id,
                    UserId      = o.UserId,
                    Status      = o.Status,
                    TotalAmount = o.TotalAmount,
                    CreatedAt   = o.CreatedAt
                })
                .ToListAsync();

            return new AdminStatsResponse
            {
                TotalProducts    = totalProducts,
                TotalOrders      = totalOrders,
                TotalUsers       = totalUsers,
                TotalRevenue     = totalRevenue,
                LowStockProducts = lowStock,
                RecentOrders     = recentOrders
            };
        }

        public async Task<GetOrderHistoryResponse> GetAllOrders(int page, int pageSize, string? statusFilter)
        {
            var query = _dbContext.Orders.AsQueryable();
            if (!string.IsNullOrWhiteSpace(statusFilter))
                query = query.Where(o => o.Status == statusFilter);

            var totalCount = await query.CountAsync();
            var orders = await query
                .OrderByDescending(o => o.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var orderIds = orders.Select(o => o.Id).ToList();
            var userIds  = orders.Select(o => o.UserId).Distinct().ToList();
            var allItems = await _dbContext.OrderItems
                .Where(i => orderIds.Contains(i.OrderId))
                .ToListAsync();
            var userEmails = await _dbContext.Users
                .Where(u => userIds.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id, u => u.Email);

            return new GetOrderHistoryResponse
            {
                Page       = page,
                PageSize   = pageSize,
                TotalCount = totalCount,
                Orders     = orders.Select(o => new OrderResponse
                {
                    Id          = o.Id,
                    UserId      = o.UserId,
                    UserEmail   = userEmails.GetValueOrDefault(o.UserId),
                    Status      = o.Status,
                    TotalAmount = o.TotalAmount,
                    CreatedAt   = o.CreatedAt,
                    UpdatedAt   = o.UpdatedAt,
                    Items       = allItems
                        .Where(i => i.OrderId == o.Id)
                        .Select(i => new OrderItemResponse
                        {
                            ProductId   = i.ProductId,
                            ProductName = i.ProductName,
                            UnitPrice   = i.UnitPrice,
                            Quantity    = i.Quantity
                        }).ToList()
                }).ToList()
            };
        }
    }
}
