using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models.Common;
using API.Models.EnterpriseDtos;
using API.Models.JoinedEntities;

namespace API.Models.Entities
{
    public class Enterprise : DateEntityData
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public EnterpriseType Type { get; set; }
        public bool Active { get; set; }

        public virtual ICollection<EnterpriseAccount> EnterpriseAccounts { get; set; }
    }
}