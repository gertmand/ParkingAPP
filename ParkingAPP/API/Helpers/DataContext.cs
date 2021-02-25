using System;
using API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options){} 

        public DbSet<Account> Accounts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Account>().Property(i => i.Id).HasIdentityOptions(startValue: 4);

            modelBuilder.Entity<Account>().HasData(
                new Account 
                {
                    Id = 1,
                    Title = "Mr",
                    FirstName = "Gert",
                    LastName = "Mänd",
                    Email = "german@ttu.ee",
                    PasswordHash = "$2a$11$XMJY4NPSLnwRYdRLCXMtQ.wL4L9VHjRORvgue2uNxaG6urN9Cr9Su",
                    AcceptTerms = true,
                    Role = Role.Admin,
                    VerificationToken = null,
                    Verified = new DateTime(2020, 02, 01)
            });
        }
    }
}