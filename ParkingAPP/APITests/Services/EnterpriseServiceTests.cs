using System;
using System.Collections.Generic;
using System.Linq;
using API.DAL;
using API.Helpers;
using API.Models.AccountDtos;
using API.Models.EnterpriseDtos;
using API.Models.Entities;
using API.Models.JoinedEntities;
using API.Services;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace APITests.Services
{
    public class EnterpriseServiceTests
    {
        public DbContextOptions<DataContext> _options;
        public DataContext _context;
        public IMapper _mapper;
        private EnterpriseService eService;

        public EnterpriseServiceTests()
        {
            _options = new DbContextOptionsBuilder<DataContext>().UseInMemoryDatabase(databaseName: "db").Options;
            _context = new DataContext(_options);
            _context.Enterprises.Add(new Enterprise
            {
                Id = 1,
                Name = "ERGO",
                Description = "Parkimine",
                Active = true,
                Created = new DateTime(2021, 02, 01),
                Type = EnterpriseType.Ettevõte
            });
            _context.Accounts.Add(new Account
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
            });
            _context.EnterpriseAccounts.Add(new EnterpriseAccount
                {AccountId = 2, EnterpriseId = 1, IsAdmin = true, CanBook = true, Enterprise = _context.Enterprises.Find(1), Account = _context.Accounts.Find(2)});
            _context.Reservations.Add(new Reservation
            {
                ParkingSpotId = 1, ReserverAccountId = 2, SpotAccount = _context.Accounts.Find(1), ReserverAccount = _context.Accounts.Find(2)
            });
            _context.Cars.Add(new Car { RegNr = "123ABC", Temporary = false, AccountCars = new List<AccountCars>() });
            _context.AccountCars.Add(new AccountCars{Account = _context.Accounts.Find(2),AccountId = 2,CarId = 4,Car = _context.Cars.Find(4)});
            _context.SaveChanges();
            if (_mapper == null)
            {
                var mappingConfig = new MapperConfiguration(mc =>
                {
                    mc.AddProfile(new AutoMapperProfile());
                });
                IMapper mapper = mappingConfig.CreateMapper();
                _mapper = mapper;
            }
            eService = new EnterpriseService(_context, _mapper);
        }

        [Test]
        public void CanCreateTest()
        {
            EnterpriseService eservice = new EnterpriseService(_context,_mapper);
            Assert.IsNotNull(eservice);
        }
        [Test]
        public void GetAllTest()
        {
            var response = eService.GetAll().Count();
            Assert.AreEqual(2, response);
        }

        [Test]
        public void GetByIdTest()
        {
            var response = eService.GetById(1);
            Assert.IsNotNull(response);
        }

        [Test]
        public void GetAllByAccountIdTest()
        {
            var response = eService.GetAllByAccountId(2).Count();
            Assert.AreEqual(1, response);
        }

        [Test]
        public void CreateTest()
        {
            var enterpriseCountBeforeAdd = eService.GetAll().Count();
            EnterpriseCreateRequest request = new EnterpriseCreateRequest
            {
                AcceptTerms = true,
                UserId = 1,
                Description = "kortermaja",
                Name = "Vilde tee 100",
                type = EnterpriseType.Ühistu
            };
            eService.Create(request);
            var enterpriseCountAfterAdd = eService.GetAll().Count();
            Assert.AreEqual(enterpriseCountAfterAdd, enterpriseCountBeforeAdd+1);
        }

        [Test]
        public void GetReservationsTest()
        {
            var response = eService.GetReservations();
            Assert.AreEqual(response.Count(),1);
        }

        [Test]
        public void CheckUserEnterpriseTest()
        {
            var responseFalse = eService.CheckUserEnterprise(1, 1);
            var responseTrue = eService.CheckUserEnterprise(2, 1);
            Assert.AreEqual(true, responseTrue);
            Assert.AreEqual(false, responseFalse);
        }

        [Test]
        public void GetEnterpriseAccountsWithoutParkingspotsTest()
        {
            var response = eService.GetEnterpriseAccountsWithoutParkingspots(2).Count();
            Assert.AreEqual(response, 1);
        }

        [Test]
        public void GetEnterpriseAdminTest()
        {
            var response = eService.GetEnterpriseAdmin(1, 2);
            Assert.AreEqual(true,response);
        }

        [Test]
        public void GetEnterpriseDataTest()
        {
            var response = eService.GetEnterpriseData(1, 2);
            Assert.AreEqual(true, response);
        }

        [Test]
        public void ValidatePhoneNumberTest()
        {
            var response = eService.ValidatePhoneNumber("+5122 1876");
            Assert.AreEqual(response, true);
        }

        [Test]
        public void ValidateCarNumberTest()
        {
            var response = eService.ValidateCarNumber("123abc", 1);
            Assert.AreEqual(response, "Autol numbriga 123abc on lubatud selles parklas parkida.");
        }

        [Test]
        public void ChangeCanBookStatusTest()
        {
            var response = eService.ChangeCanBookStatus(1, 2);
            Assert.AreEqual(false,response);
            eService.ChangeCanBookStatus(1, 2);
        }

        [Test]
        public void GetEnterpriseAccountsTest()
        {
            var response = eService.GetEnterpriseAccounts(1);
            Assert.AreEqual(response.Count(),1);
        }

        [Test]
        public void GetUserDataTest()
        {
            var response = eService.GetUserData(2);
            Assert.AreEqual(response.FirstName,"Taavi");
        }

    }
}
