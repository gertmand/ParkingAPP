using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models.EnterpriseDtos;
using API.Models.JoinedEntities;

namespace API.Models.Entities
{
    public class Enterprise
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public EnterpriseType Type { get; set; }
        public bool Active { get; set; }
        public DateTime Created { get; set; }

        public ICollection<EnterpriseAccount> EnterpriseAccounts { get; set; }
    }
}
