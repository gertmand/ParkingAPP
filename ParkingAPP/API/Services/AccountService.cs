using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using API.DAL;
using API.Helpers;
using API.Models.AccountDtos;
using API.Models.Entities;
using API.Models.JoinedEntities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using BC = BCrypt.Net.BCrypt;
using Type = API.Models.LogDtos.Type;

namespace API.Services
{
    public interface IAccountService
    {
        AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress);
        AuthenticateResponse RefreshToken(string token, string ipAddress);
        void RevokeToken(string token, string ipAddress);
        void Register(RegisterRequest model, string origin);
        void VerifyEmail(string token);
        void ForgotPassword(ForgotPasswordRequest model, string origin);
        void ValidateResetToken(ValidateResetTokenRequest model);
        void ResetPassword(ResetPasswordRequest model);
        IList<CarResponse> GetCarsByAccountId(int id);
        IEnumerable<AccountResponse> GetAll();
        AccountResponse GetById(int id);
        AccountResponse Create(CreateRequest model);
        AccountResponse Update(int id, UpdateRequest model);
        void Delete(int id);
        void AddCar(int id,  AddCarRequest request);
        void DeleteCar(int id, CarResponse request);
        void EditAccount(int id, EditAccountRequest request);
    }

    public class AccountService : IAccountService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly AppSettings _appSettings;
        private readonly IEmailService _emailService;
        private readonly ILogService _logService;

        public AccountService(
            DataContext context,
            IMapper mapper,
            IOptions<AppSettings> appSettings,
            IEmailService emailService,
            ILogService logService)
        {
            _context = context;
            _mapper = mapper;
            _emailService = emailService;
            _logService = logService;
            _appSettings = appSettings.Value;
        }

        public AccountService(
            DataContext context,
            IMapper mapper,
            IEmailService emailService,
            ILogService logService)
        {
            _context = context;
            _mapper = mapper;
            _emailService = emailService;
            _logService = logService;
        }

        public AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress)
        {
            var account = _context.Accounts.SingleOrDefault(x => x.Email == model.Email);

            if (account == null || !account.IsVerified || !BC.Verify(model.Password, account.PasswordHash))
                return null;

            // authentication successful so generate jwt and refresh tokens
            var jwtToken = generateJwtToken(account);
            var refreshToken = generateRefreshToken(ipAddress);
            account.RefreshTokens.Add(refreshToken);

            // remove old refresh tokens from account
            removeOldRefreshTokens(account);

            // save changes to db
            _context.Update(account);
            _context.SaveChanges();

            var response = _mapper.Map<AuthenticateResponse>(account);
            response.JwtToken = jwtToken;
            response.RefreshToken = refreshToken.Token;
            return response;
        }

        public AuthenticateResponse RefreshToken(string token, string ipAddress)
        {
            var (refreshToken, account) = getRefreshToken(token);

            // replace old refresh token with a new one and save
            var newRefreshToken = generateRefreshToken(ipAddress);
            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.RevokedByIp = ipAddress;
            refreshToken.ReplacedByToken = newRefreshToken.Token;
            account.RefreshTokens.Add(newRefreshToken);

            removeOldRefreshTokens(account);

            _context.Update(account);
            _context.SaveChanges();

            // generate new jwt
            var jwtToken = generateJwtToken(account);

            var response = _mapper.Map<AuthenticateResponse>(account);
            response.JwtToken = jwtToken;
            response.RefreshToken = newRefreshToken.Token;
            return response;
        }

        public void RevokeToken(string token, string ipAddress)
        {
            var (refreshToken, account) = getRefreshToken(token);

            // revoke token and save
            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.RevokedByIp = ipAddress;
            _context.Update(account);
            _context.SaveChanges();
        }

        public void Register(RegisterRequest model, string origin)
        {
            // validate
            if (_context.Accounts.Any(x => x.Email == model.Email))
            {
                // send already registered error in email to prevent account enumeration
                sendAlreadyRegisteredEmail(model.Email, origin);
                //TODO: kui o aega siis kasuta seda osa, et kasutajale anda info olemaoleva emaili kohta. 
                //throw new AppException("Email on juba olemas!");
                return;
            }

            // map model to new account object
            var account = _mapper.Map<Account>(model);

            // first registered account is an admin
            var isFirstAccount = _context.Accounts.Count() == 0;
            account.Role = isFirstAccount ? Role.Admin : Role.User;
            account.Created = DateTime.UtcNow;
            //account.VerificationToken = randomTokenString();

            // hash password
            account.PasswordHash = BC.HashPassword(model.Password);


            //temporary solution for testing. 
            account.Verified = DateTime.UtcNow;
            account.VerificationToken = null;

            // save account
            _context.Accounts.Add(account);
            _context.SaveChanges();

            var user = _context.Accounts.Where(x => x.Email == model.Email).FirstOrDefault();
            string logDescription = "Registreeriti uus kasutaja: " + user.Email;
            _logService.CreateLog(user.Id, null, null, null, Type.UserRegister, logDescription);

            // send email
            sendVerificationEmail(account, origin);
        }

        public void VerifyEmail(string token)
        {
            var account = _context.Accounts.SingleOrDefault(x => x.VerificationToken == token);

            if (account == null) throw new AppException("Verification failed");

            account.Verified = DateTime.UtcNow;
            account.VerificationToken = null;

            _context.Accounts.Update(account);
            _context.SaveChanges();
        }

        public void ForgotPassword(ForgotPasswordRequest model, string origin)
        {
            var account = _context.Accounts.SingleOrDefault(x => x.Email == model.Email);

            // always return ok response to prevent email enumeration
            if (account == null) return;

            // create reset token that expires after 1 day
            account.ResetToken = randomTokenString();
            account.ResetTokenExpires = DateTime.UtcNow.AddDays(1);

            _context.Accounts.Update(account);
            _context.SaveChanges();

            // send email
            sendPasswordResetEmail(account, origin);
        }

        public void ValidateResetToken(ValidateResetTokenRequest model)
        {
            var account = _context.Accounts.SingleOrDefault(x =>
                x.ResetToken == model.Token &&
                x.ResetTokenExpires > DateTime.UtcNow);

            if (account == null)
                throw new AppException("Invalid token");
        }

        public void ResetPassword(ResetPasswordRequest model)
        {
            var account = _context.Accounts.SingleOrDefault(x =>
                x.ResetToken == model.Token &&
                x.ResetTokenExpires > DateTime.UtcNow);

            if (account == null)
                throw new AppException("Invalid token");

            // update password and remove reset token
            account.PasswordHash = BC.HashPassword(model.Password);
            account.PasswordReset = DateTime.UtcNow;
            account.ResetToken = null;
            account.ResetTokenExpires = null;

            _context.Accounts.Update(account);
            _context.SaveChanges();
        }

        public IEnumerable<AccountResponse> GetAll()
        {
            var accounts = _context.Accounts;
            return _mapper.Map<IList<AccountResponse>>(accounts);
        }

        public AccountResponse GetById(int id)
        {
            var account = getAccount(id);
            return _mapper.Map<AccountResponse>(account);
        }

        public AccountResponse Create(CreateRequest model)
        {
            // validate
            if (_context.Accounts.Any(x => x.Email == model.Email))
                throw new AppException($"Email '{model.Email}' is already registered");

            // map model to new account object
            var account = _mapper.Map<Account>(model);
            account.Created = DateTime.UtcNow;
            account.Verified = DateTime.UtcNow;

            // hash password
            account.PasswordHash = BC.HashPassword(model.Password);

            // save account
            _context.Accounts.Add(account);
            _context.SaveChanges();

            return _mapper.Map<AccountResponse>(account);
        }

        public AccountResponse Update(int id, UpdateRequest model)
        {
            var account = getAccount(id);

            // validate
            if (account.Email != model.Email && _context.Accounts.Any(x => x.Email == model.Email))
                throw new AppException($"Email '{model.Email}' is already taken");

            // hash password if it was entered
            if (!string.IsNullOrEmpty(model.Password))
                account.PasswordHash = BC.HashPassword(model.Password);

            // copy model to account and save
            _mapper.Map(model, account);
            account.Updated = DateTime.UtcNow;
            _context.Accounts.Update(account);
            _context.SaveChanges();

            // TODO: See on UPDATE mitte registreerimine, l�hub testid �ra hetkel
            //var user = _context.Accounts.Where(x => x.Email == model.Email).FirstOrDefault();
            //string logDescription = "Registreeriti uus kasutaja: " + user.Email;
            //_logService.CreateLog(user.Id, null, null, null, Type.UserRegister, logDescription);

            return _mapper.Map<AccountResponse>(account);
        }

        public void Delete(int id)
        {
            var account = getAccount(id);
            _context.Accounts.Remove(account);
            _context.SaveChanges();
        }

        //CARS
        public IList<CarResponse> GetCarsByAccountId(int id)
        {
            var account = getAccount(id);
            var cars = account.AccountCars.Select(x => x.Car);
            List<CarResponse> resultCars = new List<CarResponse>();
            foreach (Car car in cars)
            {
                string temp = null;
                if (car.Temporary)
                {
                    temp = "Jah";
                }
                else
                {
                    temp = "Ei";
                }
                resultCars.Add(new CarResponse
                    { Id = car.Id, RegNr = car.RegNr, Temporary = temp }
                );
            }

            return resultCars;
        }

        public void AddCar(int id, AddCarRequest request)
        {
            var car = _mapper.Map<Car>(request);
            if (_context.Cars.Include(x => x.AccountCars)
                .Where(x => x.RegNr == car.RegNr.Trim()).Select(x => x.AccountCars.Where(x => x.AccountId == id)).Any())
            {
                throw new AppException("�hte ja sama s�idukit ei ole v�imalik mitu korda lisada!");
            }
            string pattern = @"^[a-zA-Z0-9]+$";
            Regex regex = new Regex(pattern);
            if (!regex.IsMatch(car.RegNr))
            {
                throw new AppException("Sisestage korrektne numbrim�rk!");
            }
            _context.Cars.Add(car);
            _context.SaveChanges();
            var carId = _context.Cars.OrderByDescending(x => x.Id).FirstOrDefault().Id;
            AccountCars ac = new AccountCars()
            {
                CarId = carId,
                AccountId = id
            };
            _context.AccountCars.Add(ac);

            string logDescription = "Lisatud uus s�iduk numbrim�rgiga " + car.RegNr + ".";
            _logService.CreateLog(id,null,null,null,Type.CarAdd,logDescription);

            _context.SaveChanges();
        }

        public void DeleteCar(int id, CarResponse request)
        {
            var car = _context.Cars.Find(request.Id);
            _context.Cars.Remove(car);

            string logDescription = "Kustutatud s�iduk numbrim�rgiga " + car.RegNr + ".";
            _logService.CreateLog(id, null, null, null, Type.CarDelete, logDescription);

            _context.SaveChanges();
        }

        public void EditAccount(int id, EditAccountRequest request)
        {
            var user = _context.Accounts.Find(id);
            string logDescription = "Kasutaja andmete muudatus: ";
            if (user.FirstName != request.FirstName)
            {
                logDescription += user.FirstName + " -> " + request.FirstName + " ";
            }
            user.FirstName = request.FirstName;
            if (user.LastName != request.LastName)
            {
                logDescription += user.LastName + " -> " + request.LastName + " ";
            }
            user.LastName = request.LastName;
            if (user.PhoneNr != request.PhoneNr)
            {
                logDescription += user.PhoneNr + " -> " + request.PhoneNr + " ";
            }
            user.PhoneNr = request.PhoneNr;
            _context.Accounts.Update(user);

            _logService.CreateLog(id, null, null, null, Type.UserEdit, logDescription);

            _context.SaveChanges();
        }


        // helper methods

        private Account getAccount(int id)
        {
            var account = _context.Accounts.Include(x => x.AccountCars).ThenInclude(x => x.Car).Where(x => x.Id == id).First();
            if (account == null) throw new KeyNotFoundException("Account not found");
            return account;
        }

        private (RefreshToken, Account) getRefreshToken(string token)
        {
            var account = _context.Accounts.SingleOrDefault(u => u.RefreshTokens.Any(t => t.Token == token));
            if (account == null) throw new AppException("Invalid token");
            var refreshToken = account.RefreshTokens.Single(x => x.Token == token);
            if (!refreshToken.IsActive) throw new AppException("Invalid token");
            return (refreshToken, account);
        }

        private string generateJwtToken(Account account)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", account.Id.ToString()) }),
                Expires = DateTime.UtcNow.AddDays(7), // TODO MUUTA EXPIRE DATE
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private RefreshToken generateRefreshToken(string ipAddress)
        {
            return new RefreshToken
            {
                Token = randomTokenString(),
                Expires = DateTime.UtcNow.AddDays(7),
                Created = DateTime.UtcNow,
                CreatedByIp = ipAddress
            };
        }

        private void removeOldRefreshTokens(Account account)
        {
            account.RefreshTokens.RemoveAll(x => 
                !x.IsActive && 
                x.Created.AddDays(_appSettings.RefreshTokenTTL) <= DateTime.UtcNow);
        }

        private string randomTokenString()
        {
            using var rngCryptoServiceProvider = new RNGCryptoServiceProvider();
            var randomBytes = new byte[40];
            rngCryptoServiceProvider.GetBytes(randomBytes);
            // convert random bytes to hex string
            return BitConverter.ToString(randomBytes).Replace("-", "");
        }

        private void sendVerificationEmail(Account account, string origin)
        {
            string message;
            if (!string.IsNullOrEmpty(origin))
            {
                var verifyUrl = $"{origin}/account/verify-email?token={account.VerificationToken}";
                message = $@"<p>Please click the below link to verify your email address:</p>
                             <p><a href=""{verifyUrl}"">{verifyUrl}</a></p>";
            }
            else
            {
                message = $@"<p>Please use the below token to verify your email address with the <code>/accounts/verify-email</code> api route:</p>
                             <p><code>{account.VerificationToken}</code></p>";
            }

            _emailService.Send(
                to: account.Email,
                subject: "Sign-up Verification API - Verify Email",
                html: $@"<h4>Verify Email</h4>
                         <p>Thanks for registering!</p>
                         {message}"
            );
        }

        private void sendAlreadyRegisteredEmail(string email, string origin)
        {
            string message;
            if (!string.IsNullOrEmpty(origin))
                message = $@"<p>If you don't know your password please visit the <a href=""{origin}/account/forgot-password"">forgot password</a> page.</p>";
            else
                message = "<p>If you don't know your password you can reset it via the <code>/accounts/forgot-password</code> api route.</p>";

            _emailService.Send(
                to: email,
                subject: "Sign-up Verification API - Email Already Registered",
                html: $@"<h4>Email Already Registered</h4>
                         <p>Your email <strong>{email}</strong> is already registered.</p>
                         {message}"
            );
        }

        private void sendPasswordResetEmail(Account account, string origin)
        {
            string message;
            if (!string.IsNullOrEmpty(origin))
            {
                var resetUrl = $"{origin}/account/reset-password?token={account.ResetToken}";
                message = $@"<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                             <p><a href=""{resetUrl}"">{resetUrl}</a></p>";
            }
            else
            {
                message = $@"<p>Please use the below token to reset your password with the <code>/accounts/reset-password</code> api route:</p>
                             <p><code>{account.ResetToken}</code></p>";
            }

            _emailService.Send(
                to: account.Email,
                subject: "Sign-up Verification API - Reset Password",
                html: $@"<h4>Reset Password Email</h4>
                         {message}"
            );
        }
    }
}
