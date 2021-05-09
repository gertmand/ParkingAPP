using System;
using System.Collections.Generic;
using System.Linq;
using API.DAL;
using API.Models.AccountDtos;
using API.Models.EnterpriseDtos;
using API.Models.Entities;
using API.Models.JoinedEntities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Type = API.Models.LogDtos.Type;

namespace API.Services
{
    public interface IEnterpriseService
    {
        EnterpriseResponse GetById(int id);
        void Create(EnterpriseCreateRequest request);
        IEnumerable<EnterpriseResponse> GetAll();
        IEnumerable<EnterpriseResponse> GetAllByAccountId(int userId);
        IEnumerable<Reservation> GetReservations();
        IEnumerable<EnterpriseAccountsResponse> GetEnterpriseAccounts(int enterpriseId);
        IEnumerable<EnterpriseAccountsResponse> GetEnterpriseAccountsWithoutParkingspots(int enterpriseId);
        AccountResponse GetUserData(int userId);
        bool CheckUserEnterprise(int userId, int enterpriseId);
        bool GetEnterpriseAdmin(int enterpriseId, int userId);
        bool GetEnterpriseData(int enterpriseId, int userId);
        bool ChangeCanBookStatus(int adminId, int enterpriseId, int accountId);
        bool ValidatePhoneNumber(string phoneNumber);
        string ValidateCarNumber(string carNr, int enterpriseId);
        IEnumerable<EnterpriseInvitationResponse> GetUserInvitations(string email);
        void SetInvitationApprovedStatus(EnterpriseInvitationRequest request);
        void CreateUserInvitations(int adminId, int enterpriseId, UserInvitationRequest[] emails);
    }


    public class EnterpriseService : IEnterpriseService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly ILogService _logService;

        public EnterpriseService(DataContext context, IMapper mapper, ILogService logService)
        {
            _context = context;
            _mapper = mapper;
            _logService = logService;
        }

        public IEnumerable<EnterpriseResponse> GetAll()
        {
            var enterprises = getAllEnterprises();
            return _mapper.Map<IList<EnterpriseResponse>>(enterprises);
        }

        public EnterpriseResponse GetById(int id)
        {
            var enterprise = getEnterprise(id);
            return _mapper.Map<EnterpriseResponse>(enterprise);
        }

        public IEnumerable<EnterpriseResponse> GetAllByAccountId(int userId)
        {
            var enterprises = getEnterprisesByUserId(userId);

            return _mapper.Map<IList<EnterpriseResponse>>(enterprises);
        }

        public void Create(EnterpriseCreateRequest request)
        {
            var enterprise = _mapper.Map<Enterprise>(request);
            enterprise.Active = true;
            enterprise.Created = DateTime.UtcNow;
            _context.Enterprises.Add(enterprise);
            _context.SaveChanges();
            var enterpriseId = _context.Enterprises.OrderByDescending(x=>x.Id).FirstOrDefault().Id;
            EnterpriseAccount ea = new EnterpriseAccount() { AccountId = request.UserId, EnterpriseId = enterpriseId, IsAdmin = true, CanBook = true };

            string logDescription = "Registreeriti uus parkla: Nimi: " + request.Name + " Kirjeldus: " + request.Description + " Tüüp: " + request.type;
            _logService.CreateLog(request.UserId, null, null, enterpriseId, Type.EnterpriseRegister, logDescription);

            _context.EnterpriseAccounts.Add(ea);
            _context.SaveChanges();
        }

        public IEnumerable<Reservation> GetReservations()
        {
            return _context.Reservations.Include(x => x.SpotAccount).Include(x => x.ReserverAccount).ToList();
        }

        public bool CheckUserEnterprise(int userId, int enterpriseId)
        {
            var enterprises = getEnterprisesByUserId(userId);

            if (enterprises.Any(x => x.Id == enterpriseId))
            {
                return true;
            }
            return false;
        }

        public IEnumerable<EnterpriseAccountsResponse> GetEnterpriseAccountsWithoutParkingspots(int enterpriseId) 
        {
            var regularUsersList = new List<EnterpriseAccountsResponse>();

            var enterpriseParkingSpots = _context.ParkingSpots.Where(x => x.EnterpriseId == enterpriseId).Select(x=>x.Id);
            var spotUsers = _context.ParkingSpotAccounts.Where(x=> enterpriseParkingSpots.Contains(x.ParkingSpotId)).ToListAsync().Result.Select(x => x.AccountId);

            var enterpriseUsers = _context.EnterpriseAccounts
                .Include(x => x.Account)
                .Where(x => x.EnterpriseId == enterpriseId).ToList();

            foreach (var user in enterpriseUsers)
            {
                if (!spotUsers.Contains(user.AccountId))
                {
                    regularUsersList.Add(new EnterpriseAccountsResponse
                    {
                        Id = user.AccountId,
                        FirstName = user.Account.FirstName,
                        LastName = user.Account.LastName
                    });
                }
            }

            return regularUsersList;
        }

        public bool GetEnterpriseAdmin(int enterpriseId, int userId)
        {
            var isAdmin = _context.EnterpriseAccounts
                .Where(x => x.AccountId == userId && x.EnterpriseId == enterpriseId).First().IsAdmin;

            return isAdmin;
        }

        public bool GetEnterpriseData(int enterpriseId, int userId)
        {
            var canBook = _context.EnterpriseAccounts
                .Where(x => x.AccountId == userId && x.EnterpriseId == enterpriseId).First().CanBook;

            return canBook;
        }

        public IEnumerable<EnterpriseInvitationResponse> GetUserInvitations(string email)
        {
            var userInvitations = getUserInvitations(email);
            return _mapper.Map<IList<EnterpriseInvitationResponse>>(userInvitations);
        }

        public void SetInvitationApprovedStatus(EnterpriseInvitationRequest request)
        {
            var invitation = _context.Invitations
                .Where(x => x.EnterpriseId == request.EnterpriseId && x.Email == request.Email).FirstOrDefault();
            if (request.Approved == false)
            {
                invitation.Approved = false;
                invitation.ApprovedAt =DateTime.Now;
                invitation.Updated = DateTime.Now;
                _context.SaveChanges();
            }
            else
            {
                invitation.Approved = true;
                invitation.ApprovedAt = DateTime.Now;
                invitation.Updated = DateTime.Now;

                _context.EnterpriseAccounts.Add(new EnterpriseAccount
                {
                    AccountId = request.UserId,
                    EnterpriseId = request.EnterpriseId,
                    CanBook = true,
                    IsAdmin = false
                });

                _context.SaveChanges();
            }
        }

        // Validate methods for client
        public bool ValidatePhoneNumber(string phoneNumber)
        {
            List<string> phoneNumbers = new List<string>();
            string temp;
            string numberToValidate = phoneNumber.Replace("+", "").Replace(" ", "");
            if (numberToValidate.StartsWith("372")) numberToValidate = numberToValidate.Remove(0, 3);
            if (numberToValidate.Length < 15 && numberToValidate.All(char.IsDigit))
            {
                foreach (var account in _context.Accounts)
                {
                    if (account.PhoneNr != null)
                    {
                        temp = account.PhoneNr.Replace("+", "").Replace(" ", "");
                        if (temp.StartsWith("372")) temp = temp.Remove(0, 3);
                        phoneNumbers.Add(temp);
                    }
                }

                if (phoneNumbers.Contains(numberToValidate)) return true;
            }

            return false;
        }

        public string ValidateCarNumber(string carNr, int enterpriseId)
        {
            List<string> carNrs = new List<string>();
            string temp = carNr.Replace(" ", "").ToLower();
            List<int> enterpriseAccountIds = new List<int>(_context.EnterpriseAccounts.Where(x => x.EnterpriseId == enterpriseId).Select(x=>x.AccountId));
            List<int> accountCarsAccountIds = new List<int>(_context.AccountCars.Select(x => x.AccountId));
            foreach (var aId in enterpriseAccountIds)
            {
                if (accountCarsAccountIds.Contains(aId))
                {
                    carNrs.AddRange(_context.AccountCars.Where(x=>x.AccountId == aId).Select(x=>x.Car).Select(x=>x.RegNr.Replace(" ","").ToLower()));
                }
            }
            
            if (temp.Length <= 8 && temp.All(char.IsLetterOrDigit))
            {
                foreach (var number in carNrs)
                {
                    if (number == temp)
                    {
                        return "Autol numbriga " + carNr + " on lubatud selles parklas parkida.";
                    }
                        
                }
                return "Autol numbriga " + carNr + " ei ole lubatud selles parklas parkida.";
            }
            return "Viga. Kontrolli numbrimärki";
        }

        // ADMIN METHODS

        public void CreateUserInvitations(int adminId, int enterpriseId, UserInvitationRequest[] emails)
        {
            var invs = _context.Invitations.AsEnumerable();
            foreach (var email in emails)
            {
                if (!invs.Where(x => x.Email == email.email).Where(x => x.EnterpriseId == enterpriseId).Where(x => x.Approved == false).Any())
                {

                    _context.Invitations.Add(new Invitation()
                    {
                        Approved = false,
                        Created = DateTime.UtcNow.AddHours(3),
                        Updated = DateTime.UtcNow.AddHours(3),
                        Email = email.email,
                        EnterpriseId = enterpriseId
                    });
                }
            }

            _context.SaveChanges();

        }

        public bool ChangeCanBookStatus(int adminId, int enterpriseId, int accountId)
        {
            var ea = _context.EnterpriseAccounts.Find( accountId, enterpriseId);
            var admin = _context.Accounts.Where(x => x.Id == adminId).FirstOrDefault();
            var user = _context.Accounts.Where(x => x.Id == accountId).FirstOrDefault();
            string logDescription = "Kasutaja " + user.FirstName + " " + user.LastName
                                    + " broneerimisõigus muudetud " + admin.FirstName + " " + admin.LastName +
                                    " poolt: ";
            
            if (!ea.CanBook)
            {
                logDescription += "Saab broneerida";
            }
            else
            {
                logDescription += "Ei saa broneerida";
            }
            ea.CanBook = !ea.CanBook;
            _logService.CreateLog(accountId, null, adminId, enterpriseId, Type.UserCanBook, logDescription);
            _context.SaveChanges();

            return ea.CanBook;
        }

        public IEnumerable<EnterpriseAccountsResponse> GetEnterpriseAccounts(int enterpriseId)
        {
            var enterpriseUsers = _context.EnterpriseAccounts.Include(x => x.Account)
                .Where(x => x.EnterpriseId == enterpriseId).Select(x => x.Account).ToList();
            return _mapper.Map<IList<EnterpriseAccountsResponse>>(enterpriseUsers);
        }

        public AccountResponse GetUserData(int userId)
        {
            var user = _context.Accounts.Include(x => x.AccountCars).ThenInclude(x => x.Car).Where(x => x.Id == userId)
                .First();

            return _mapper.Map<AccountResponse>(user);
        }

        public void CreateUserInvitations(int adminId, int enterpriseId, UserInvitationRequest[] emails)
        {
            var invs = _context.Invitations.AsEnumerable();
            foreach (var email in emails)
            {
                if (!invs.Where(x => x.Email == email.email).Where(x => x.EnterpriseId == enterpriseId).Where(x => x.Approved == false).Any())
                {

                    _context.Invitations.Add(new Invitation()
                    {
                        Approved = false,
                        Created = DateTime.UtcNow.AddHours(3),
                        Updated = DateTime.UtcNow.AddHours(3),
                        Email = email.email,
                        EnterpriseId = enterpriseId
                    });
                }
            }

            _context.SaveChanges();

        }

        // helper methods

        private Enterprise getEnterprise(int id)
        {
            var enterprise = _context.Enterprises.Find(id);
            // var enterprises = enterpriseRepo.get(id);
            if(enterprise == null) throw new KeyNotFoundException("Enterprise not found");
            return enterprise;
        }

        private IEnumerable<Enterprise> getEnterprisesByUserId(int userId)
        {
            var enterprises = _context.Enterprises
                .Include(x => x.EnterpriseAccounts)
                .Where(x => x.EnterpriseAccounts.Any(x => x.AccountId == userId)).ToList();

            return enterprises;
        }

        private IEnumerable<Enterprise> getAllEnterprises()
        {
            var enterprises = _context.Enterprises;
            return enterprises;
        }

        private IEnumerable<EnterpriseInvitationResponse> getUserInvitations(string email)
        {
            var enterprises = _context.Enterprises;
            var invitations = _context.Invitations.Where(x => x.Email == email).ToList();
            IList<EnterpriseInvitationResponse> invitationResponses = new List<EnterpriseInvitationResponse>();
            if (invitations != null)
            {
                foreach (var invitation in invitations)
                {
                    if (invitation.Approved == false && invitation.DeletionDate == null && invitation.ApprovedAt == null)
                    {
                        invitationResponses.Add(new EnterpriseInvitationResponse
                        {
                            InvitationId = invitation.Id,
                            EnterpriseId = invitation.EnterpriseId,
                            Email = invitation.Email,
                            EnterpriseName = enterprises.Find(invitation.EnterpriseId).Name,
                            Type = Enum.GetName(typeof(EnterpriseType), enterprises.Find(invitation.EnterpriseId).Type)
                        });
                    }
                    
                }

                return invitationResponses;
            }

            return invitationResponses;
        }
    }
}
