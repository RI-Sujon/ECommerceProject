using Project.Object.Requests;
using Project.Object.Responses;

namespace Project.Application.Service.Defination
{
    public interface ICategoryService
    {
        Task<List<CategoryResponseModel>> GetCategories();
        Task<CategoryResponseModel> GetCategoryById(int id);
        Task<CategoryResponseModel> AddCategory(CategoryRequestModel request);
        Task<CategoryResponseModel> UpdateCategory(int id, CategoryRequestModel request);
        Task DeleteCategory(int id);
    }
}
