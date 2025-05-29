using Project.Application.Extensions;
using Project.Data;
using Project.Core;
using Project.Core.Caching;
using Project.Core.Log;
using Microsoft.EntityFrameworkCore;
using Boooks.Net.Endpoint.ActionFilters;

var builder = WebApplication.CreateBuilder(args); 

builder.Services.AddManagersDependencyGroup();
builder.Services.AddScoped<IApplicationContext, ApplicationContext>();
builder.Services.AddScoped<ICacheProvider, InMemoryCacheProvider>();
builder.Services.AddSingleton<ILogProvider, DummyLogger>();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.OperationFilter<AddRequiredHeaderParameter>();
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", cors =>
    {
        cors.WithOrigins("https://localhost:7100")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.  
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("DevCors");
//app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();

app.MapControllers();

app.Run();
