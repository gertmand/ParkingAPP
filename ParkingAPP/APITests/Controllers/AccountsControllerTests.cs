using System;
using API.Controllers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using NUnit.Framework;


namespace APITests.Controllers
{
    [TestFixture]
    public class AccountsControllerTests : BaseController
    {
        


        public AccountsControllerTests() { }
        public AccountsControllerTests(
            IAccountService accountService,
            IMapper mapper)
        {
            
        }
        [SetUp]
        public void Setup()
        {

        }

        [Test]
        public void CanCreateAccountsControllerTest()
        {
            Assert.Pass();
        }

        [Test]
        public void AuthenticateTest()
        {
            Assert.Pass();
        }

        [Test]
        public void RefreshTokenTest()
        {
            Assert.Pass();
        }

        [Test]
        public void RevokeTokenTest()
        {
            Assert.Pass();
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

        [Test]
        public void GetAllTest()
        {
            Assert.Pass();
        }

        [Test]
        public void GetByIdTest()
        {
            Assert.Pass();
        }

        [Test]
        public void CreateTest()
        {
            Assert.Pass();
        }

        [Test]
        public void UpdateTest()
        {
            Assert.Pass();
        }

        [Test]
        public void DeleteTest()
        {
            Assert.Pass();
        }
        // cars

        [Test]
        public void AddCarTest()
        {
            Assert.Pass();
        }


        [Test]
        public void DeleteCarTest()
        {
            Assert.Pass();
        }

        private void setTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", token, cookieOptions);
        }


        private string ipAddress()
        {
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
                return Request.Headers["X-Forwarded-For"];
            else
                return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
        }
    }
}
