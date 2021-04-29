using System;
using System.Linq;
using System.Net;
using API.DAL;
using API.Helpers;
using API.Models.AccountDtos;
using API.Models.Entities;
using API.Services;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace APITests.Services
{
    [TestFixture]
    public class AccountServiceTests
    {
        public DbContextOptions<DataContext> _options;
        public DataContext _context;
        public IMapper _mapper;
        public IEmailService _emailService;
        private AccountService aService;

        public AccountServiceTests()
        {
            _options = new DbContextOptionsBuilder<DataContext>().UseInMemoryDatabase(databaseName: "db").Options;
            _context = new DataContext(_options);
            _context.Accounts.Add(new Account
            {
                Id = 1,
                Title = "Mr",
                FirstName = "Gert",
                LastName = "Mänd",
                Email = "gert2@ttu.ee",
                PasswordHash = "$2a$11$XMJY4NPSLnwRYdRLCXMtQ.wL4L9VHjRORvgue2uNxaG6urN9Cr9Su",
                AcceptTerms = true,
                Role = Role.Admin,
                VerificationToken = null,
                Verified = new DateTime(2020, 02, 01),
                PhoneNr = "+372 5123 1231"
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
            aService = new AccountService(_context, _mapper, _emailService);
        }

        [Test]
        public void CanCreateTest()
        {
            AccountService aservice = new AccountService(_context,_mapper,_emailService);
            Assert.IsNotNull(aservice);
        }

        [Test]
        public void GetByIdTest()
        {
            var response = aService.GetById(1);
            Assert.IsNotNull(response);
        }

        [Test]
        public void GetAllTest()
        {
            var response = aService.GetAll().Count();
            Assert.IsTrue(response > 0);
        }

        [Test]
        public void CreateTest()
        {
            CreateRequest r = new CreateRequest
            {
                FirstName = "Taavi",
                LastName = "Meier",
                Email = "tmeier@ttu.ee",
                Title = "mees",
                Password = "test",
                ConfirmPassword = "test",
                Role = Role.Admin.ToString()
            };
            var response = aService.Create(r);
            Assert.IsNotNull(response);
            

        }

        [Test]
        public void UpdateTest()
        {
            UpdateRequest ur = new UpdateRequest
            {
                FirstName = "Taavi",
                LastName = "Meier",
                Email = "tame@ttu.ee",
                Role = Role.Admin.ToString(),
                Title = "mees",
                Password = "test",
                ConfirmPassword = "test"
            };
            var response = aService.Update(1, ur);
            var date = response.Updated.Value.Date;
            var name = response.FirstName + " " + response.LastName;
            var email = response.Email;
            Assert.AreEqual(DateTime.UtcNow.Date, date);
            Assert.AreEqual("Taavi Meier", name);
            Assert.AreEqual("tame@ttu.ee", email);
        }

        [Test]
        public void DeleteTest()
        {
            var count = aService.GetAll().Count();
            aService.Delete(10);
            var countAfterDelete = aService.GetAll().Count();
            Assert.AreEqual(count-1,countAfterDelete);
        }

        [Test]
        public void AddCarTest()
        {
            AddCarRequest request = new AddCarRequest
            {
                RegNr = "123test",
                Temporary = false,
            };
            aService.AddCar(1, request);
            var count = _context.Cars.Count();
            Assert.AreEqual(2, count);
            //_context.Cars.Remove(_context.Cars.Find(1));
            //_context.AccountCars.Remove(_context.AccountCars.Find(1, 1));
            _context.SaveChanges();
        }

        [Test]
        public void GetCarsByAccountIdTest()
        {
            AddCarRequest request = new AddCarRequest
            {
                RegNr = "123est",
                Temporary = false,
            };
            aService.AddCar(1, request);
            var result = aService.GetCarsByAccountId(1).Count;
            Assert.AreEqual(2, result);
        }

        [Test]
        public void DeleteCarTest()
        {
            var countBeforeAdd = _context.Cars.Count();
            AddCarRequest request = new AddCarRequest
            {
                RegNr = "123test",
                Temporary = false,
            };
            aService.AddCar(1, request);
            var countAfterAdd = _context.Cars.Count();
            CarResponse cr = new CarResponse { Id = 2, RegNr = "123est", Temporary = "false" };
            aService.DeleteCar(cr);
            Assert.AreEqual(countBeforeAdd, countAfterAdd - 1);
        }

        [Test]
        public void EditAccount()
        {
            EditAccountRequest request = new EditAccountRequest
            {
                FirstName = "Gert2"
            };
            aService.EditAccount(1, request);
            Assert.AreEqual("Gert2", _context.Accounts.Find(1).FirstName);
        }
    }
}
