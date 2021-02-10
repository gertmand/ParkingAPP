using API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options){} 

        public DbSet<Account> Accounts { get; set; }



        protected override void OnModelCreating(ModelBuilder modelbuilder)
        {

        }
    }
}