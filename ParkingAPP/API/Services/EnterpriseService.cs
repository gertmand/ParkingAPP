using System;
using System.Collections.Generic;
using System.Linq;
using API.DAL;
using API.Models.AccountDtos;
using API.Models.EnterpriseDtos;
using API.Models.Entities;
using API.Models.JoinedEntities;
using API.Models.ParkingSpotDtos;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Math.EC.Rfc7748;

namespace API.Services
{
    public interface IEnterpriseService
    {
        EnterpriseResponse GetById(int id);
        EnterpriseResponse Create(EnterpriseCreateRequest model);
        IEnumerable<EnterpriseResponse> GetAll();
        IEnumerable<EnterpriseResponse> GetAllByAccountId(int userId);
        IEnumerable<Reservation> GetReservations();
        IEnumerable<EnterpriseAccountsResponse> GetEnterpriseAccounts(int enterpriseId);
        IEnumerable<EnterpriseAccountsResponse> GetEnterpriseAccountsWithoutParkingspots(int enterpriseId);
        AccountResponse GetUserData(int userId);
        bool CheckUserEnterprise(int userId, int enterpriseId);
        bool GetEnterpriseAdmin(int enterpriseId, int userId);
        bool GetEnterpriseData(int enterpriseId, int userId);

        bool ChangeCanBookStatus(int enterpriseId, int accountId);
    }


    public class EnterpriseService : IEnterpriseService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public EnterpriseService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public IEnumerable<EnterpriseResponse> GetAll()
        {
            throw new NotImplementedException();
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


        public EnterpriseResponse Create(EnterpriseCreateRequest model)
        {
            throw new NotImplementedException();
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

            var spotUsers = _context.ParkingSpotAccounts.ToListAsync().Result.Select(x => x.AccountId);

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

        // ADMIN METHODS

        public bool ChangeCanBookStatus(int enterpriseId, int accountId)
        {
            var ea = _context.EnterpriseAccounts.Find( accountId, enterpriseId);
            ea.CanBook = !ea.CanBook;
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
            var user = _context.Accounts.Find(userId);

            return _mapper.Map<AccountResponse>(user);
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
    }
}
