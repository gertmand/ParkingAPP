using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace API.Models.EnterpriseDtos
{
    public class EnterpriseInvitationResponse
    {
        public int InvitationId { get; set; }
        public int EnterpriseId { get; set; }
        public string EnterpriseName { get; set; }
        public string Type { get; set; }
        public string Email { get; set; }
    }
}
