using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.EnterpriseDtos
{
    public class EnterpriseInvitationResponse
    {
        public int EnterpriseId { get; set; }
        public string EnterpriseName { get; set; }
        public EnterpriseType Type { get; set; }
        public string Email { get; set; }
    }
}
