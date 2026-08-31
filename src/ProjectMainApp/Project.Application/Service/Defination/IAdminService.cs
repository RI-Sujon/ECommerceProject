using Project.Object.Responses;

namespace Project.Application.Service.Defination
{
    public interface IAdminService
    {
        Task<AdminStatsResponse> GetStats();
        Task<GetOrderHistoryResponse> GetAllOrders(int page, int pageSize, string? statusFilter);
    }
}
