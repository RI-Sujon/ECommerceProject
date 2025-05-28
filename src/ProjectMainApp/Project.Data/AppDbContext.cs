using Microsoft.EntityFrameworkCore;
using Project.Object.Entities;
using Project.Object.Responses;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure Product entity
        builder.Entity<ProductEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
        });
    }

    // You can add other DbSets here
    public DbSet<ProductEntity> Products { get; set; }
}
