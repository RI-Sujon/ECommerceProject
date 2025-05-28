using System.Data;
using Project.Core;
using Microsoft.Extensions.DependencyInjection;
using Project.Object.Responses;
using Project.Object.Requests;
using Project.Object.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Project.Application.Provider.Product.Query
{
    public class GetProductListQuery
    {
        private readonly IApplicationContext _applicationContext;
        private readonly AppDbContext _dbContext;

        public GetProductListQuery(IApplicationContext applicationContext, AppDbContext dbContext)
        {
            _applicationContext = applicationContext;
            _dbContext = dbContext;
        }

        public async Task<GetProductListResponse> GetProductList(GetProductListRequest request)
        {
            var query = _dbContext.Products.AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(request.SearchText))
            {
                query = query.Where(p => p.Name.Contains(request.SearchText) || 
                                        p.Description.Contains(request.SearchText));
            }

            if (request.CategoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == request.CategoryId.Value);
            }

            if (request.MinPrice.HasValue)
            {
                query = query.Where(p => p.Price >= request.MinPrice.Value);
            }

            if (request.MaxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= request.MaxPrice.Value);
            }

            if (request.IsActive.HasValue)
            {
                query = query.Where(p => p.IsActive == request.IsActive.Value);
            }

            var response = new GetProductListResponse
            {
                Page = request.Page,
                PageSize = request.PageSize,
                TotalCount = await query.CountAsync()
            };

            // Apply pagination
            var products = await query
                .Skip((int)((request.Page - 1) * request.PageSize))
                .Take((int)request.PageSize)
                .Select(p => new Product
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    CategoryId = p.CategoryId,
                    IsActive = p.IsActive,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                })
                .ToListAsync();

            response.Products = products;
            return response;
        }
    }
} 