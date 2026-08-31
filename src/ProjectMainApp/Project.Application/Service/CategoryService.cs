using Microsoft.EntityFrameworkCore;
using Project.Application.Service.Defination;
using Project.Object.Entities;
using Project.Object.Requests;
using Project.Object.Responses;

namespace Project.Application.Service
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _dbContext;

        public CategoryService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<CategoryResponseModel>> GetCategories()
        {
            return await _dbContext.Categories
                .Where(c => c.IsActive)
                .Select(c => new CategoryResponseModel
                {
                    Id = c.Id,
                    Name = c.Name,
                    Slug = c.Slug,
                    ParentId = c.ParentId,
                    IsActive = c.IsActive
                })
                .OrderBy(c => c.Name)
                .ToListAsync();
        }

        public async Task<CategoryResponseModel> GetCategoryById(int id)
        {
            var category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Id == id);
            if (category == null)
                throw new KeyNotFoundException($"Category with ID {id} not found.");

            return new CategoryResponseModel
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                ParentId = category.ParentId,
                IsActive = category.IsActive
            };
        }

        public async Task<CategoryResponseModel> AddCategory(CategoryRequestModel request)
        {
            var category = new CategoryEntity
            {
                Name = request.Name,
                Slug = request.Slug,
                ParentId = request.ParentId,
                IsActive = true
            };

            _dbContext.Categories.Add(category);
            await _dbContext.SaveChangesAsync();

            return new CategoryResponseModel
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                ParentId = category.ParentId,
                IsActive = category.IsActive
            };
        }

        public async Task<CategoryResponseModel> UpdateCategory(int id, CategoryRequestModel request)
        {
            var category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Id == id);
            if (category == null)
                throw new KeyNotFoundException($"Category with ID {id} not found.");

            category.Name = request.Name;
            category.Slug = request.Slug;
            category.ParentId = request.ParentId;
            await _dbContext.SaveChangesAsync();

            return new CategoryResponseModel
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                ParentId = category.ParentId,
                IsActive = category.IsActive
            };
        }

        public async Task DeleteCategory(int id)
        {
            var category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Id == id);
            if (category == null)
                throw new KeyNotFoundException($"Category with ID {id} not found.");

            category.IsActive = false;
            await _dbContext.SaveChangesAsync();
        }
    }
}
