using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project.Application.Service.Defination;
using Project.Object;
using Project.Object.Requests;
using Project.Object.Responses;

namespace Project.Endpoint.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult> GetCategories()
        {
            var result = await _categoryService.GetCategories();
            return Ok(new ResponseModel<List<CategoryResponseModel>> { IsSuccess = true, Data = result });
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult> GetCategoryById(int id)
        {
            var result = await _categoryService.GetCategoryById(id);
            return Ok(new ResponseModel<CategoryResponseModel> { IsSuccess = true, Data = result });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult> AddCategory(CategoryRequestModel request)
        {
            var result = await _categoryService.AddCategory(request);
            return Ok(new ResponseModel<CategoryResponseModel> { IsSuccess = true, Data = result });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<ActionResult> UpdateCategory(int id, CategoryRequestModel request)
        {
            var result = await _categoryService.UpdateCategory(id, request);
            return Ok(new ResponseModel<CategoryResponseModel> { IsSuccess = true, Data = result });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            await _categoryService.DeleteCategory(id);
            return Ok(new ResponseModel<object> { IsSuccess = true });
        }
    }
}
