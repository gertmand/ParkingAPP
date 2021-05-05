using System;
using System.Collections.Generic;
using System.Linq;
using API.DAL;
using API.Helpers;
using API.Models.AccountDtos;
using API.Models.Entities;
using API.Models.JoinedEntities;
using API.Models.ParkingSpotDtos;
using API.Services;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace APITests.Services
{
    public class ParkingSpotServiceTests
    {
        public DbContextOptions<DataContext> _options;
        public DataContext _context;
        public IMapper _mapper;
        private ParkingSpotService pService;
        private LogService logService;
        private EmailService emailService;

        public ParkingSpotServiceTests()
        {
            _options = new DbContextOptionsBuilder<DataContext>().UseInMemoryDatabase(databaseName: "db").Options;
            _context = new DataContext(_options);

            _context.ParkingSpots.AddRange(
                new ParkingSpot{ EnterpriseId = 1, Number = 1, Enterprise = _context.Enterprises.Find(1)},
                new ParkingSpot{EnterpriseId = 1, Number = 2,}
                );
            _context.ParkingSpotAccounts.Add(new ParkingSpotAccount {AccountId = 1, ParkingSpotId = 1});
            _context.ParkingSpotAccounts.Add(new ParkingSpotAccount { AccountId = 2, ParkingSpotId = 2 });
            _context.ReleasedSpots.Add(new ReleasedSpot
            {
                ParkingSpotId = 1,
                StartDate = new DateTime(2021,1,1,10,00,00).ToUniversalTime(),
                EndDate = new DateTime(2021, 12, 1, 10, 00, 00).ToUniversalTime(),
                ParkingSpot = _context.ParkingSpots.Find(1)

            });
            _context.Reservations.Add(new Reservation {ParkingSpotId = 1, ReserverAccountId = 2});
            _context.EnterpriseAccounts.Add(new EnterpriseAccount 
                {AccountId = 3, EnterpriseId = 1, Enterprise = _context.Enterprises.Find(1),Account = _context.Accounts.Find(3),CanBook = true,IsAdmin = true});
            _context.Accounts.Add(new Account
            {
                Id = 3,
                Title = "Mr",
                FirstName = "Test",
                LastName = "Isik3",
                Email = "german@ttu.ee",
                PasswordHash = "$2a$11$XMJY4NPSLnwRYdRLCXMtQ.wL4L9VHjRORvgue2uNxaG6urN9Cr9Su",
                AcceptTerms = true,
                Role = Role.Admin,
                VerificationToken = null,
                Verified = new DateTime(2020, 02, 01),
                EnterpriseAccounts = new List<EnterpriseAccount>()
            });
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
            pService = new ParkingSpotService(_context, _mapper, logService, emailService);
        }

        [Test]
        public void CanCreateTest()
        {
            ParkingSpotService pservice = new ParkingSpotService(_context,_mapper, logService, emailService);
            Assert.IsNotNull(pservice);
        }
        [Test]
        public void GetAllTest()
        {
            var response = pService.GetAll(1).Count();
            Assert.IsTrue(response > 0);
        }
        [Test]
        public void GetByIdTest()
        {
            var response = pService.GetById(1);
            Assert.AreEqual(response.Number, 1);
        }
        [Test]
        public void GetUserReservationsTest()
        {
            var response = pService.GetUserReservations(1, 2).Count();
            Assert.AreEqual(response, 2);
        }
        [Test]
        public void GetUserParkingSpotTest()
        {
            var response = pService.GetUserParkingSpot(1, 1).Number;
            Assert.AreEqual(response, 1);
        }
        [Test]
        public void GetParkingSpotStatusTest()
        {
            var response = pService.GetParkingSpotStatus(1);
            Assert.AreEqual(ParkingSpotStatusType.Released,response);
        }
        [Test]
        public void GetParkingSpotListDataTest()
        {
            var response = pService.GetParkingSpotListData(1);
            Assert.AreEqual(response.Count(), 3);
        }
        [Test]
        public void ReleaseParkingSpotTest()
        {
            ReleaseRequest request = new ReleaseRequest
            {
                EnterpriseId = 1,
                ParkingSpaceId = 2,
                EndDate = DateTime.Today,
                StartDate = DateTime.Today
            };
            var response = pService.ReleaseParkingSpot(1,request);
            Assert.AreEqual(response.StartDate, DateTime.Today.ToUniversalTime());
        }
        [Test]
        public void ReserveParkingSpotTest()
        {
            ReservationRequest request = new ReservationRequest
            {
                ParkingSpotId = 1,
                StartDate = DateTime.Today.ToUniversalTime(),
                EndDate = DateTime.Today.ToUniversalTime(),
                ReserverAccountId = 2,
            };
            var response = pService.ReserveParkingSpot(1,request);
            Assert.AreEqual(response.ReserverAccountId, 2);
        }
        [Test]
        public void GetAvailableDatesForReservationTest()
        {
            AvailableDatesRequest responseRequest = new AvailableDatesRequest
            {
                StartDate = DateTime.Today.ToUniversalTime(),
                EndDate = DateTime.Today.ToUniversalTime(),
            };
            var response = pService.GetAvailableDatesForReservation(responseRequest, 1, 2);
            Assert.AreEqual(response.Count(),1);
        }
        [Test]
        public void AddParkingSpotTest()
        {
            ParkingSpotRequest request = new ParkingSpotRequest { Number = 3 };
            var response = pService.AddParkingSpot(1, request, 1).Created.Date;
            Assert.AreEqual(response, DateTime.UtcNow.Date);
        }
        [Test]
        public void AddParkingSpotArrayTest()
        {
            var responseBeforeAdd = pService.GetAll(1).Count();
            ParkingSpotRequest[] request = { new ParkingSpotRequest() { Number = 2 }, new ParkingSpotRequest() { Number = 4 }, new ParkingSpotRequest() { Number = 5 } }; 
            pService.AddParkingSpotArray(1, request, 1);
            var responseAfterAdd = pService.GetAll(1).Count();
            Assert.AreEqual(responseBeforeAdd+2, responseAfterAdd);
        }
        [Test]
        public void DeleteParkingSpotTest()
        {
            var response = pService.DeleteParkingSpot(1, 5);
            Assert.AreEqual(response.Id, 5);
        }
        [Test]
        public void GetParkingSpotsMainUsersTest()
        {
            var response = pService.GetParkingSpotsMainUsers(1).Count();
            Assert.AreEqual(2, response);
        }
        [Test]
        public void AddParkingSpotMainUserTest()
        {
            ParkingSpotMainUserRequest request = new ParkingSpotMainUserRequest{AccountId = 3,CanBook = true,ParkingSpotId = 3};
            var response = pService.AddParkingSpotMainUser(1, request);
            Assert.AreEqual(response.MainUserFullName, "Test Isik3");
        }
        [Test]
        public void DeteleParkingSpotMainUserTest()
        {
            var response = pService.DeleteParkingSpotMainUser(1, 3, 3);
            Assert.AreEqual(response.MainUserFullName, "Test Isik3");
        }

    }
}
