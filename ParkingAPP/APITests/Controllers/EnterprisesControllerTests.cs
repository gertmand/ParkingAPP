using System;
using API.Controllers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using NUnit.Framework;

namespace APITests.Controllers
{
    [TestFixture]
    public class EnterprisesControllerTests
    {
        private readonly IEnterpriseService _enterpriseService;
        private readonly IParkingSpotService _parkingSpotService;
        private readonly IAccountService _accountService;
        private readonly IMapper _mapper;
        [System.Obsolete]
        private readonly IHostingEnvironment hostEnvironment;

        [SetUp]
        [Obsolete]
        public void Setup()
        {
            var eController = new EnterprisesController( _enterpriseService, _parkingSpotService, _accountService, _mapper, hostEnvironment);
        }

        // ENTERPRISE METHODS

        [Test]
        public void GetEnterpriseTest()
        {
            Assert.Pass();
        }

        [Test]
        public void GetUserEnterprisesTest()
        {
            Assert.Pass();
        }

        [Test]
        public void GetUsersWithoutParkingSpaceTest()
        {
            Assert.Pass();
        }

        [Test]
        public void GetEnterpriseUserDataTest()
        {
            Assert.Pass();
        }

        [Test]
        public void GetEnterpriseParkingSpotDataTest()
        {
            Assert.Pass();
        }

        [Test]
        public void CreateTest()
        {
            Assert.Pass();
        }


        // Validate methods for client
        [Test]
        public void ValidatePhoneNumberTest()
        {
            Assert.Pass();
        }

        [Test]
        public void ValidateCarNumberTest()
        {
            Assert.Pass();
        }


        // PARKING METHODS (PARKING, RESERVATION, RELEASE)

        [Test]
        public void GetReservationsTest()
        {
            Assert.Pass();
        }

        [Test]
        public void ReleaseSpotTest()
        {
            Assert.Pass();
        }

        [Test]
        public void PostReservationTest()
        {
            Assert.Pass();
        }

        [Test]
        public void GetAvailableDatesForReservationTest()
        {
            Assert.Pass();
        }

        // ADMIN METHODS

        [Test]
        public void GetEnterpriseUsersTest()
        {
            Assert.Pass();
        }

        [Test]
        public void GetEnterpriseParkingSpotsTest()
        {
            Assert.Pass();
        }

        [Test]
        public void GetEnterpriseParkingSpotsMainUsersTest()
        {
            Assert.Pass();
        }

        [Test]
        public void ChangeCanBookStatusTest()
        {
            Assert.Pass();
        }

        [Test]
        public void AddParkingSpotTest()
        {
            Assert.Pass();
        }

        [Test]
        public void AddParkingSpotArrayTest()
        {
            Assert.Pass();
        }

        [Test]
        public void AddParkingSpotMainUserTest()
        {
            Assert.Pass();
        }

        [Test]
        public void AddParkingLotPlanTest()
        {
            Assert.Pass();
        }

        [Test]
        public void DeleteParkingSpotTest()
        {
            Assert.Pass();
        }

        [Test]
        public void DeleteParkingSpotMainUserTest()
        {
            Assert.Pass();
        }

        [Test]
        public void GetUserDataTest()
        {
            Assert.Pass();
        }
    }
}
