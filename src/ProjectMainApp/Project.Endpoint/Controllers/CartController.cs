using Microsoft.AspNetCore.Mvc;

namespace Project.Endpoint.Controllers
{
    public class CartController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
