using Project.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project.Application.Provider.Cart
{
    public class CartProvider : ICartProvider
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IApplicationContext _applicationContext;

        public CartProvider(IApplicationContext applicationContext, IServiceProvider serviceProvider)
        {
            _applicationContext = applicationContext;
            _serviceProvider = serviceProvider;
        }
    }
}
