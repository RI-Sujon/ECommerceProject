using Project.Object.Responses;

namespace Project.Application.Service.Defination
{
    public interface IOrderService
    {
        Task<OrderResponse> Checkout(int userId);
        Task<GetOrderHistoryResponse> GetOrderHistory(int userId, int page, int pageSize, string? statusFilter = null);
        Task<OrderResponse> GetOrderById(int orderId, int userId);
        Task UpdateOrderStatus(int orderId, string newStatus);
        Task CancelOrder(int orderId, int userId);
    }
}
