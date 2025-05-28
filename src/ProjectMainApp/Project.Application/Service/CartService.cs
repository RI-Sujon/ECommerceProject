using Project.Application.Provider.Cart;
using Project.Application.Service.Defination;
using Project.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project.Application.Service
{
    public class CartService : ICartService
    {
        private readonly ICartProvider _cartProvider;
        private readonly IApplicationContext _applicationContext;

        public CartService(IApplicationContext applicationContext, ICartProvider cartProvider)
        {
            _cartProvider = cartProvider;
            _applicationContext = applicationContext;
        }
    }
}
