using System;
using System.Linq;
using System.Net;
using API.Controllers;
using API.DAL;
using API.Helpers;
using API.Models.AccountDtos;
using API.Models.Entities;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;


namespace APITests.Controllers
{
    [TestFixture]
    public class AccountsControllerTests : BaseController
    {
        private readonly IPAddress fakeIpAddress = IPAddress.Parse("127.168.1.32");
        private readonly IAccountService _accountService;
        private readonly ILogService _logService;
        private readonly IMapper _mapper;
        private AccountsController aController;
        public DbContextOptions<DataContext> _options;
        public DataContext _context;
        public IEmailService _emailService;
        private AccountService aService;

        public AccountsControllerTests()
        {
            _options = new DbContextOptionsBuilder<DataContext>().UseInMemoryDatabase(databaseName: "db").Options;
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
                Id = 10,
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
            _context.Accounts.Add(a);
            _context.SaveChanges();
            var httpContext = new DefaultHttpContext();
            httpContext.Items["Account"] = a;
            httpContext.Connection.RemoteIpAddress = fakeIpAddress;

            aService = new AccountService(_context, _mapper, _emailService, _logService);
            _accountService = aService;
            aController = new AccountsController(aService, _mapper);
            aController.ControllerContext = new ControllerContext{HttpContext = httpContext};
        }

        [Test]
        public void AuthenticateTest()
        {
            AuthenticateRequest request = new AuthenticateRequest
            { 
                Email = "german@ttu.ee",
                Password = "$2a$11$XMJY4NPSLnwRYdRLCXMtQ.wL4L9VHjRORvgue2uNxaG6urN9Cr9Su"
            };
            Assert.IsNotNull(aController.Authenticate(request));
        }

        [Test]
        public void CanCreateAccountsControllerTest()
        {
            
            AccountsController acontroller = new AccountsController(_accountService, _mapper);
            Assert.IsNotNull(acontroller);
        }

        [Test]
        public void CheckExistingEmailTest()
        {
            var response = aController.CheckExistingEmail("tmeier@ttu.ee");
            Assert.AreEqual(true, response);
        }

        [Test]
        public void GetUserDataTest()
        {
            Assert.IsNotNull(aController.GetUserData());
        }
        [Test]
        public void GetAllTest()
        {
            var response = aController.GetAll();
            Assert.IsNotNull(response);
        }

        [Test]
        public void GetByIdTest()
        {
           
            var response = aController.GetById(10);
            Assert.IsNotNull(response);
            
        }

        [Test]
        public void CreateTest()
        {
            CreateRequest request = new CreateRequest
            {
                FirstName = "test",
                LastName = "test",
                Password = "test",
                ConfirmPassword = "test",
                Role = Role.Admin.ToString(),
                Title = "mees",
                Email = "test@test.ee"
            };
            var response = aController.Create(request);
            Assert.IsNotNull(response);
        }

        [Test]
        public void UpdateTest()
        {
            UpdateRequest request = new UpdateRequest {FirstName = "Test2"};
            var response = aController.Update(10, request);
            Assert.IsNotNull(response);
        }

        [Test]
        public void DeleteTest()
        {
            int id = _context.Accounts.Where(x => x.FirstName == "test").FirstOrDefault().Id;
            var response = aController.Delete(id);
            Assert.IsNotNull(response);
        }

        [Test]
        public void AddCarTest()
        {
            AddCarRequest request = new AddCarRequest
            {
                RegNr = "999xxx",
                Temporary = true
            };
            Assert.IsNotNull(aController.AddCar(request));
            int id = _context.Cars.Where(x => x.RegNr == "999xxx").FirstOrDefault().Id;
            
        }

        [Test]
        public void DeleteCarTest()
        {
            _context.Cars.Add(new Car {RegNr = "test", Id = 12, Temporary = true});
            CarResponse response = new CarResponse
            {
                Id = 12,
                RegNr = "test",
                Temporary = "true",
            };

            var controllerResponse = aController.DeleteCar(response);
            Assert.IsNotNull(controllerResponse);
            _context.SaveChanges();
        }

        [Test]
        public void EditUserTest()
        {
            EditAccountRequest request = new EditAccountRequest{FirstName = "Test5"};
            var response = aController.EditUser(request);
            Assert.IsNotNull(response);
        }

    }
}
