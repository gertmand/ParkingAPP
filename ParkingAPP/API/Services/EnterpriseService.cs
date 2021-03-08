using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Helpers;
using API.Models.EnterpriseDtos;
using API.Models.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public interface IEnterpriseService
    {
        EnterpriseResponse GetById(int id);
        EnterpriseResponse Create(EnterpriseCreateRequest model);
        IEnumerable<EnterpriseResponse> GetAll();
        IEnumerable<EnterpriseResponse> GetAllByAccountId(int userId);
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

        // helper methods

        private Enterprise getEnterprise(int id)
        {
            var enterprise = _context.Enterprises.Find(id);
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
