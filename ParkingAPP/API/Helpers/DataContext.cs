using System;
using System.Collections.Generic;
using API.Models.EnterpriseDtos;
using API.Models.Entities;
using API.Models.JoinedEntities;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options){} 

        public DbSet<Account> Accounts { get; set; }
        public DbSet<Enterprise> Enterprises { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<EnterpriseAccount>().ToTable("EnterpriseAccounts")
                .HasKey(key => new {key.AccountId, key.EnterpriseId});
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
                },
                new Account 
                {
                    Id = 2,
                    Title = "Mr",
                    FirstName = "Taavi",
                    LastName = "Meier",
                    Email = "tmeier@ttu.ee",
                    PasswordHash = "$2a$11$XMJY4NPSLnwRYdRLCXMtQ.wL4L9VHjRORvgue2uNxaG6urN9Cr9Su", //aera123(4)
                    AcceptTerms = true,
                    Role = Role.Admin,
                    VerificationToken = null,
                    Verified = new DateTime(2020, 02, 01)
                },
                new Account 
                {
                    Id = 3,
                    Title = "Mr",
                    FirstName = "Kevin",
                    LastName = "Kiil",
                    Email = "kekiil@ttu.ee",
                    PasswordHash = "$2a$11$XMJY4NPSLnwRYdRLCXMtQ.wL4L9VHjRORvgue2uNxaG6urN9Cr9Su", //aera123(4)
                    AcceptTerms = true,
                    Role = Role.Admin,
                    VerificationToken = null,
                    Verified = new DateTime(2020, 02, 01)
                });

            modelBuilder.Entity<Enterprise>().HasData(
                new Enterprise
                {
                    Id = 1,
                    Name = "ERGO Parkimine",
                    Description = "Parkimine",
                    Active = true,
                    Created = new DateTime(2021, 02, 01),
                    Type = EnterpriseType.Business
                });

            modelBuilder.Entity<EnterpriseAccount>().HasData(
                new List<EnterpriseAccount>
                {
                    new EnterpriseAccount {AccountId = 1, EnterpriseId = 1},
                    new EnterpriseAccount {AccountId = 2, EnterpriseId = 1},
                    new EnterpriseAccount {AccountId = 3, EnterpriseId = 1}
                });
        }
    }
}