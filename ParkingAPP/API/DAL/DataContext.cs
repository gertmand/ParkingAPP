using System;
using System.Collections.Generic;
using API.Models.AccountDtos;
using API.Models.EnterpriseDtos;
using API.Models.Entities;
using API.Models.JoinedEntities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

namespace API.DAL
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options){} 

        public DbSet<Account> Accounts { get; set; }
        public DbSet<Enterprise> Enterprises { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<ParkingSpot> ParkingSpots { get; set; }
        public DbSet<ReleasedSpot> ReleasedSpots { get; set; }
        public DbSet<Car> Cars { get; set; }

        // Joined Entitied

        public DbSet<ParkingSpotAccount> ParkingSpotAccounts { get; set; }
        public DbSet<EnterpriseAccount> EnterpriseAccounts { get; set; }
        public DbSet<AccountCars> AccountCars { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Car>().ToTable("Cars").HasKey(x => x.Id);
            modelBuilder.Entity<AccountCars>().ToTable("AccountCars").HasKey(key => new { key.AccountId, key.CarId });
            modelBuilder.Entity<EnterpriseAccount>().ToTable("EnterpriseAccounts")
                .HasKey(key => new {key.AccountId, key.EnterpriseId});
            modelBuilder.Entity<ParkingSpotAccount>().ToTable("ParkingSpotAccount")
                .HasKey(key => new {key.AccountId, key.ParkingSpotId});

            modelBuilder.Entity<Account>().Property(i => i.Id).HasIdentityOptions(startValue: 41);

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
                    Verified = new DateTime(2020, 02, 01),
                    Avatar = "gert3.png",
                    PhoneNr = "+372 5123 1231"
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
                    Verified = new DateTime(2020, 02, 01),
                    PhoneNr = "+372 5122 1876"
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
                    Verified = new DateTime(2020, 02, 01),
                    Avatar = "kev.png",
                    PhoneNr = "+372 512 1014"
                });
            for (int i = 4; i <= 24; i++)
            {
                modelBuilder.Entity<Account>().HasData(
                    new Account
                    {
                        Id = i,
                        Title = "Mr",
                        FirstName = "Test",
                        LastName = "Admin"+(i-3),
                        Email = "admin"+(i-3)+"@test.ee",
                        PasswordHash = "$2a$11$XMJY4NPSLnwRYdRLCXMtQ.wL4L9VHjRORvgue2uNxaG6urN9Cr9Su",
                        AcceptTerms = true,
                        Role = Role.Admin,
                        VerificationToken = null,
                        Verified = new DateTime(2020, 02, 01),
                        Avatar = "",
                        PhoneNr = "+372 5122 10" + i.ToString()
                    });
            }
            for (int i = 25; i <= 40; i++)
            {
                modelBuilder.Entity<Account>().HasData(
                    new Account
                    {
                        Id = i,
                        Title = "Mr",
                        FirstName = "Test",
                        LastName = "kasutaja" + (i - 24),
                        Email = "kasutaja" + (i - 24) + "@test.ee",
                        PasswordHash = "$2a$11$XMJY4NPSLnwRYdRLCXMtQ.wL4L9VHjRORvgue2uNxaG6urN9Cr9Su",
                        AcceptTerms = true,
                        Role = Role.User,
                        VerificationToken = null,
                        Verified = new DateTime(2020, 02, 01),
                        Avatar = "",
                        PhoneNr = "+372 5600 77" + i.ToString()
                    });
            }

            modelBuilder.Entity<Car>().HasData(
                new Car { Id = 1, RegNr = "699BJG", Temporary = false },
                new Car { Id = 2, RegNr = "111AAA", Temporary = false },
                new Car { Id = 3, RegNr = "222BBB", Temporary = false },
                new Car { Id = 4, RegNr = "333CCC", Temporary = false },
                new Car { Id = 5, RegNr = "444DDD", Temporary = false },
                new Car { Id = 6, RegNr = "CityBee", Temporary = true },
                new Car { Id = 7, RegNr = "ISA", Temporary = true }
            );

            modelBuilder.Entity<AccountCars>().HasData(
                new AccountCars { AccountId = 1, CarId = 1 },
                new AccountCars { AccountId = 2, CarId = 2 },
                new AccountCars { AccountId = 3, CarId = 3 },
                new AccountCars { AccountId = 4, CarId = 4 },
                new AccountCars { AccountId = 5, CarId = 5 },
                new AccountCars { AccountId = 6, CarId = 6 },
                new AccountCars { AccountId = 2, CarId = 7 },
                new AccountCars { AccountId = 11, CarId = 5 },
                new AccountCars { AccountId = 12, CarId = 5 },
                new AccountCars { AccountId = 13, CarId = 5 });

            modelBuilder.Entity<Enterprise>().HasData(
                new Enterprise
                {
                    Id = 1,
                    Name = "ERGO Parkimine",
                    Description = "Parkimine",
                    Active = true,
                    Created = new DateTime(2021, 02, 01),
                    Type = EnterpriseType.Ettevõte
                },
                new Enterprise
                {
                    Id = 2,
                    Name = "RIK Parkimine",
                    Description = "Parkimine",
                    Active = true,
                    Created = new DateTime(2021, 02, 01),
                    Type = EnterpriseType.Ettevõte
                });

            for (int i = 1; i <= 10; i++)
            {
                modelBuilder.Entity<EnterpriseAccount>().HasData(
                    new List<EnterpriseAccount>
                    {
                        new EnterpriseAccount {AccountId = i, EnterpriseId = 1, CanBook = false, IsAdmin = true},
                        new EnterpriseAccount {AccountId = i+10, EnterpriseId = 2, CanBook = false, IsAdmin = true},
                        new EnterpriseAccount {AccountId = i+20, EnterpriseId = 1},
                        new EnterpriseAccount {AccountId = i+30, EnterpriseId = 2},
                    });
            }

           

            for (var i = 1; i <= 10; i++)
            {
                modelBuilder.Entity<ParkingSpot>().HasData(
                    new ParkingSpot { Id = i, Number = i+100, EnterpriseId = 1, Created = new DateTime(2021, 01, 01), Updated = new DateTime(2021, 01, 01)},
                    new ParkingSpot { Id = i+10, Number = i +200, EnterpriseId = 2, Created = new DateTime(2021, 01, 01), Updated = new DateTime(2021, 01, 01) }
                );
            }

            for (int i = 1; i <= 10; i++)
            {
                modelBuilder.Entity<ParkingSpotAccount>().HasData(
                    new List<ParkingSpotAccount>
                    {
                        new ParkingSpotAccount {AccountId = i, ParkingSpotId = i},
                        new ParkingSpotAccount {AccountId = i+10, ParkingSpotId = i+10},
                    });
            }

            

            //modelBuilder.Entity<ReleasedSpot>().HasData(
            //    new ReleasedSpot { Id = 1, ParkingSpotId = 2, StartDate = new DateTime(2021, 01, 01), EndDate = new DateTime(2021, 05, 01)}
            //);

            //modelBuilder.Entity<Reservation>().HasData(
            //    new Reservation {Id = 1, SpotAccountId = 1, ReserverAccountId = 2, ParkingSpotId = 1, StartDate = new DateTime(2021, 01, 01), EndDate = new DateTime(2021, 05, 01) }
            //);
        }
    }
}