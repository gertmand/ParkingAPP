using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.Xml;
using System.Threading.Tasks;
using API.DAL;
using API.Helpers;
using API.Models.EnterpriseDtos;
using API.Models.Entities;
using API.Models.ParkingSpotDtos;
using AutoMapper;
using Microsoft.AspNetCore.Server.IIS.Core;
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
        bool CheckUserEnterprise(int userId, int enterpriseId);
        bool GetEnterpriseAdmin(int enterpriseId, int userId);
        bool GetEnterpriseData(int enterpriseId, int userId);
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


        //TODO EnterpriseId filter needed
        public IEnumerable<EnterpriseAccountsResponse> GetEnterpriseAccountsWithoutParkingspots(int enterpriseId) 
        {
            var regularUsersList = new List<EnterpriseAccountsResponse>();

            var spotUsers = _context.ParkingSpotAccounts.ToListAsync().Result.Select(x => x.AccountId);

            var allUsers = _context.Accounts.ToList();

            foreach (var user in allUsers)
            {
                if (!spotUsers.Contains(user.Id))
                {
                    regularUsersList.Add(new EnterpriseAccountsResponse
                    {
                        Id = user.Id,
                        FirstName = user.FirstName,
                        LastName = user.LastName
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

        public IEnumerable<EnterpriseAccountsResponse> GetEnterpriseAccounts(int enterpriseId)
        {
            var enterpriseUsers = _context.EnterpriseAccounts.Include(x => x.Account)
                .Where(x => x.EnterpriseId == enterpriseId).Select(x => x.Account).ToList();

            return _mapper.Map<IList<EnterpriseAccountsResponse>>(enterpriseUsers);
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
