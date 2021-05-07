using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.EnterpriseDtos
{
    public class EnterpriseInvitationRequest
    {
        public int EnterpriseId { get; set; }
        public string Email { get; set; }
        public bool Approved { get; set; }
        public DateTime ApprovedAt { get; set; }
    }
}
