using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using API.Controllers;
using API.DAL;
using API.Helpers;
using API.Models.AccountDtos;
using API.Models.EnterpriseDtos;
using API.Models.Entities;
using API.Models.JoinedEntities;
using API.Models.ParkingSpotDtos;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace APITests.Controllers
{
    [TestFixture]
    public class EnterprisesControllerTests
    {
        private readonly IPAddress fakeIpAddress = IPAddress.Parse("127.168.1.32");
        public DbContextOptions<DataContext> _options;
        public DataContext _context;
        private readonly IEnterpriseService eService;
        private readonly IParkingSpotService psService;
        private readonly IAccountService aService;
        private readonly ILogService _logService;
        private readonly IMapper _mapper;
        public IEmailService _emailService;
        private EnterprisesController eController;
        private EnterprisesController eController2;
        [System.Obsolete]
        private readonly IHostingEnvironment hostEnvironment;

        [Obsolete]
        public EnterprisesControllerTests()
        {
            _options = new DbContextOptionsBuilder<DataContext>().UseInMemoryDatabase(databaseName: "db2").Options;
            _context = new DataContext(_options);
            if (_mapper == null)
            {
                var mappingConfig = new MapperConfiguration(mc =>
                {
                    mc.AddProfile(new AutoMapperProfile());
                });
                IMapper mapper = mappingConfig.CreateMapper();
                _mapper = mapper;
            }
            Account a = new Account
            {
                Id = 11,
                Title = "Mr",
                FirstName = "Gert",
                LastName = "Mänd",
                Email = "german@ttu.ee",
                PasswordHash = "$2a$11$XMJY4NPSLnwRYdRLCXMtQ.wL4L9VHjRORvgue2uNxaG6urN9Cr9Su",
                AcceptTerms = true,
                Role = Role.Admin,
                VerificationToken = null,
                Verified = new DateTime(2020, 02, 01),
                PhoneNr = "+372 5123 1231"
            };
            Account b = new Account
            {
                Id = 12,
                Title = "Mr",
                FirstName = "Test",
                LastName = "Mänd",
                Email = "german@ttu.ee",
                PasswordHash = "$2a$11$XMJY4NPSLnwRYdRLCXMtQ.wL4L9VHjRORvgue2uNxaG6urN9Cr9Su",
                AcceptTerms = true,
                Role = Role.Admin,
                VerificationToken = null,
                Verified = new DateTime(2020, 02, 01),
                PhoneNr = "+372 5123 1231"
            };
            Enterprise e = new Enterprise
            {
                Id = 2,
                Active = true,
                Name = "Test",
                Type = EnterpriseType.Ettevõte,
                Description = "Testin kontrollerit"
            };
            _context.ParkingSpots.Add(new ParkingSpot
            {
                Id = 10, EnterpriseId = 2, Number = 100, Enterprise = new Enterprise(),ParkingSpotAccounts = new List<ParkingSpotAccount>()
            });
            _context.ParkingSpotAccounts.Add(new ParkingSpotAccount
                {AccountId = 11, ParkingSpotId = 10,ParkingSpot = new ParkingSpot(),Account = new Account()});
            _context.Enterprises.Add(e);
            _context.EnterpriseAccounts.Add(new EnterpriseAccount
                {AccountId = 11, EnterpriseId = 2, CanBook = true, IsAdmin = true});
            _context.EnterpriseAccounts.Add(new EnterpriseAccount
                { AccountId = 12, EnterpriseId = 2, CanBook = true, IsAdmin = true });
            _context.Accounts.Add(a);
            _context.Accounts.Add(b);
            _context.SaveChanges();
            var httpContext = new DefaultHttpContext();
            httpContext.Items["Account"] = a;
            httpContext.Connection.RemoteIpAddress = fakeIpAddress;
            var httpContext2 = new DefaultHttpContext();
            httpContext2.Items["Account"] = null;
            httpContext2.Connection.RemoteIpAddress = fakeIpAddress;
            aService = new AccountService(_context,_mapper,_emailService, _logService);
            psService = new ParkingSpotService(_context, _mapper, _logService);
            eService = new EnterpriseService(_context, _mapper, _logService);

            eController = new EnterprisesController(eService,  psService, aService, _mapper, hostEnvironment);
            eController2 = new EnterprisesController(eService, psService, aService, _mapper, hostEnvironment);
            eController.ControllerContext = new ControllerContext { HttpContext = httpContext };
            eController2.ControllerContext = new ControllerContext { HttpContext = httpContext2 };
        }

        // ENTERPRISE METHODS
        [Test]
        public void CanCreateTest()
        {
            EnterprisesController enterprisesController = new EnterprisesController(eService,psService,aService,_mapper,hostEnvironment);
            Assert.IsNotNull(enterprisesController);
        }

        [Test]
        public void GetEnterpriseTest()
        {
            var response = eController.GetEnterprise(2);
            var response2 = eController2.GetEnterprise(1);
            var response3 = eController2.GetEnterprise(2);
            var result = response.Result as OkObjectResult;
            var values = result.Value as EnterpriseResponse;
            Assert.AreEqual(values.Description,"Testin kontrollerit");
            Assert.IsNotNull(response);
            Assert.IsNotNull(response2);
            Assert.IsNotNull(response3);
        }

        [Test]
        public void GetUserEnterprisesTest()
        {
            var response = eController.GetUserEnterprises();
            var response2 = eController2.GetUserEnterprises();
            var result = response.Result as OkObjectResult;
            var values = result.Value as IEnumerable<EnterpriseResponse>;
            Assert.AreEqual(values.FirstOrDefault().Description, "Testin kontrollerit");
            Assert.IsNotNull(response);
            Assert.IsNotNull(response2);
        }

        [Test]
        public void GetUsersWithoutParkingSpaceTest()
        {
            var response = eController.GetUsersWithoutParkingSpace(2);
            var response2 = eController.GetUsersWithoutParkingSpace(1);
            Assert.IsTrue(response.Count()> 0);
            Assert.IsTrue(response2.Count() == 0);
        }

        [Test]
        public void GetEnterpriseUserDataTest()
        {
            var response = eController.GetEnterpriseUserData(2);
            Assert.AreEqual(true, response.Value.IsAdmin);
            Assert.AreEqual(false, response.Value.CanBook);
            Assert.AreEqual(0, response.Value.Reservations.Count());
            Assert.AreEqual(null, response.Value.ParkingSpot);
        }

        [Test]
        public void GetEnterpriseParkingSpotDataTest()
        {
            var response = eController.GetEnterpriseParkingSpotData(2);
            var result = response.Result as OkResult;
            Assert.AreEqual(result.StatusCode, 200);
        }

        [Test]
        public void CreateTest()
        {
            EnterpriseCreateRequest request = new EnterpriseCreateRequest
            {
                AcceptTerms = true,
                Description = "Test",
                Name = "Test",
                UserId = 11,
                type = EnterpriseType.Kool
            };
            var response = eController.Create(request);
            var result = response as OkObjectResult;
            Assert.AreEqual(result.StatusCode, 200);
        }

        // Validate methods for client
        [Test]
        public void ValidatePhoneNumberTest()
        {
            var response = eController.ValidatePhoneNumber("5123 1231");
            Assert.IsTrue(response);
        }

        [Test]
        public void ValidateCarNumberTest()
        {
            var response = eController.ValidateCarNumber("123est",2);
            Assert.AreEqual(response, "Autol numbriga 123est ei ole lubatud selles parklas parkida.");
        }

        // PARKING METHODS (PARKING, RESERVATION, RELEASE)

        [Test]
        public void GetReservationsTest()
        {
            var response = eController.GetReservations();
            var result = response.Result as OkObjectResult;
            Assert.AreEqual(result.StatusCode,200);
        }

        [Test]
        public void ReleaseSpotTest()
        {
            ReleaseRequest request = new ReleaseRequest
            {
                EnterpriseId = 2,
                ParkingSpaceId = 10,
                StartDate = new DateTime(2021,12,10),
                EndDate = new DateTime(2021, 12, 20)
            };
            var response = eController.ReleaseSpot(request);
            
            Assert.AreEqual(response.Value.ParkingSpotId,10);
        }

        [Test]
        public void PostReservationTest()
        {
            ReleaseRequest releaseRequest = new ReleaseRequest
            {
                EnterpriseId = 2,
                ParkingSpaceId = 10,
                StartDate = DateTime.UtcNow.Date,
                EndDate = DateTime.UtcNow.Date
            };
            eController.ReleaseSpot(releaseRequest);
            ReservationRequest request = new ReservationRequest{ParkingSpotId = 10,ReserverAccountId = 12,StartDate = DateTime.UtcNow.Date, EndDate = DateTime.UtcNow.Date};
            var response = eController.PostReservation(request);
            Assert.IsNotNull(response);
        }

        [Test]
        public void GetAvailableDatesForReservationTest()
        {
            AvailableDatesRequest request = new AvailableDatesRequest
            {
                StartDate = new DateTime(2021,12,31),
                EndDate = new DateTime(2021,12,1)
            };
            var response2 = eController2.GetAvailableDatesForReservation(request, 2);
            var response = eController.GetAvailableDatesForReservation(request, 2);
            Assert.IsNotNull(response);
            Assert.IsNotNull(response2);
        }

        // ADMIN METHODS

        [Test]
        public void GetEnterpriseUsersTest()
        {
            var response = eController.GetEnterpriseUsers(2);
            Assert.IsNotNull(response);
        }

        [Test]
        public void GetEnterpriseParkingSpotsTest()
        {
            var response = eController.GetEnterpriseParkingSpots(2);
            Assert.IsNotNull(response);
        }

        [Test]
        public void GetEnterpriseParkingSpotsMainUsersTest()
        {
            var response = eController.GetEnterpriseParkingSpotsMainUsers(2);
            Assert.IsNotNull(response);
        }

        [Test]
        public void ChangeCanBookStatusTest()
        {
            var response = eController.ChangeCanBookStatus(2,11);
            Assert.IsNotNull(response);
        }

        [Test]
        public void AddParkingSpotTest()
        {
            ParkingSpotRequest request = new ParkingSpotRequest
            {
                Number = 120
            };
            Assert.IsNotNull(eController.AddParkingSpot(request, 2));
        }

        [Test]
        public void AddParkingSpotArrayTest()
        {
            ParkingSpotRequest[] request =
            {
                new ParkingSpotRequest() { Number = 200 },
                new ParkingSpotRequest() { Number = 400 },
                new ParkingSpotRequest() { Number = 500 }
            };
            Assert.IsNotNull(eController.AddParkingSpotArray(request,2));
        }

        [Test]
        public void AddParkingSpotMainUserTest()
        {
            ParkingSpotMainUserRequest request = new ParkingSpotMainUserRequest
            {
                ParkingSpotId = 3,
                AccountId = 12,
                CanBook = true,
            };
            Assert.IsNotNull(eController.AddParkingSpotMainUser(request,2));
        }

        [Test]
        public void DeleteParkingSpotTest()
        {
            _context.ParkingSpots.Add(new ParkingSpot {Id = 99, Number = 99});
            _context.SaveChanges();
            Assert.IsNotNull(eController.DeleteParkingSpot(2, 99));
        }

        [Test]
        public void DeleteParkingSpotMainUserTest()
        {
            _context.ParkingSpots.Add(new ParkingSpot {Id = 100, Number = 1000});
            _context.ParkingSpotAccounts.Add(new ParkingSpotAccount {ParkingSpotId = 100, AccountId = 12});
            _context.SaveChanges();
            Assert.IsNotNull(eController.DeleteParkingSpotMainUser(2, 12, 100));
        }

        [Test]
        public void GetUserDataTest()
        {
            Assert.IsNotNull(eController.GetUserData(2,11));
        }
    }
}
