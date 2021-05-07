using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DAL;
using API.Helpers;
using API.Models.Entities;
using AutoMapper;
using Microsoft.Extensions.Options;
using Type = API.Models.LogDtos.Type;

namespace API.Services
{
    public interface ILogService
    {
        void CreateLog(int userId, int? ToAccountId, int? adminId, int? enterpriseId, Type type, string desc);
        IEnumerable<Log> GetUserLogs(int userId);
        IEnumerable<Log> GetEnterpriseLogs(int enterpriseId);
    }

    public class LogService : ILogService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public LogService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public void CreateLogAboutEdit<T>(T before, T after, int userId, int? adminId, int? enterpriseId)
        {
            Log log = new Log()
            {
                CreatedAt = DateTime.UtcNow,
                AccountId = userId,
                AdminId = adminId,
                EnterpriseId = enterpriseId
            };
            var props = before.GetType().GetProperties();
            foreach (var prop in props)
            {
                var valueBefore = prop.GetValue(before);
                var valueAfter = prop.GetValue(after);
                if (valueBefore != valueAfter)
                {
                    //log.ChangedValues.
                }
            }
        }

        public void CreateLog(int userId, int? ToAccountId, int? adminId, int? enterpriseId, Type type, string desc)
        {
            Log log = new Log()
            {
                CreatedAt = DateTime.Now,
                AccountId = userId,
                ToAccountId = ToAccountId,
                AdminId = adminId,
                EnterpriseId = enterpriseId,
                Type = type,
                Description = desc
            };
            _context.Logs.Add(log);
        }

        public IEnumerable<Log> GetUserLogs(int userId)
        {
            return _context.Logs.Where(x => x.AccountId == userId || x.ToAccountId == userId || x.AdminId == userId)
                .ToList();
        }

        public IEnumerable<Log> GetEnterpriseLogs(int enterpriseId)
        {
            return _context.Logs.Where(x => x.EnterpriseId == enterpriseId)
                .ToList();
        }
    }
}
