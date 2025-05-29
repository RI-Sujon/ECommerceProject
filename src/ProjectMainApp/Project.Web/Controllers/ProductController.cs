using Microsoft.AspNetCore.Mvc;

namespace Project.Web.Controllers
{
    public class ProductController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
} 