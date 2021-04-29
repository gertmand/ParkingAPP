using API.Controllers;
using API.DAL;
using API.Helpers;
using API.Services;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;


namespace APITests.Controllers
{
    [TestFixture]
    public class AccountsControllerTests : BaseController
    {
        private readonly IAccountService _accountService;
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
            aService = new AccountService(_context, _mapper, _emailService);
            _accountService = aService;
            aController = new AccountsController(_accountService, _mapper);
        }

        [Test]
        public void CanCreateAccountsControllerTest()
        {
            
            AccountsController acontroller = new AccountsController(_accountService, _mapper);
            Assert.IsNotNull(acontroller);
        }


        [Test]
        public void RegisterTest()
        {
            Assert.Pass();
        }

        [Test]
        public void CheckExistingEmailTest()
        {
            
            Assert.Pass();
        }

        [Test]
        public void VerifyEmailTest()
        {
            Assert.Pass();
        }

        [Test]
        public void ForgotPasswordTest()
        {
            Assert.Pass();
        }

        [Test]
        public void ValidateResetTokenTest()
        {
            Assert.Pass();
        }

        [Test]
        public void ResetPasswordTest()
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
