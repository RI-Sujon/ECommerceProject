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
            entity.HasOne<CategoryEntity>()
                  .WithMany()
                  .HasForeignKey(e => e.CategoryId)
                  .IsRequired(false);
            entity.HasIndex(e => e.Slug);
            entity.HasIndex(e => e.CategoryId);
            entity.HasIndex(e => e.IsActive);
        });

        // Configure Cart entity
        builder.Entity<CartEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne<ProductEntity>()
                  .WithMany()
                  .HasForeignKey(e => e.ProductId);
        });

        // Configure User entity
        builder.Entity<UserEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Configure Order entity
        builder.Entity<OrderEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Status);
        });

        // Configure OrderItem entity
        builder.Entity<OrderItemEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne<OrderEntity>()
                  .WithMany()
                  .HasForeignKey(e => e.OrderId);
        });
    }

    // You can add other DbSets here
    public DbSet<ProductEntity> Products { get; set; }
    public DbSet<CartEntity> Carts { get; set; }
    public DbSet<UserEntity> Users { get; set; }
    public DbSet<CategoryEntity> Categories { get; set; }
    public DbSet<OrderEntity> Orders { get; set; }
    public DbSet<OrderItemEntity> OrderItems { get; set; }
}
