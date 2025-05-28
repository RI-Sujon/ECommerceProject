using Project.Object.Entities;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure Product entity
        builder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);
        });
    }

    // You can add other DbSets here
    public DbSet<Product> Products { get; set; }
}
