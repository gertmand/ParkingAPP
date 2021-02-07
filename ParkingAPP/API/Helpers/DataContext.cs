using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MinuRaha.Entities;

namespace MinuRaha.Helpers
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