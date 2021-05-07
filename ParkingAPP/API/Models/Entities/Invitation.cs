using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using API.Models.Common;
using API.Models.EnterpriseDtos;

namespace API.Models.Entities
{
    public class Invitation : DateEntityData
    {
        public int EnterpriseId { get; set; }
        public string Email { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public bool Approved { get; set; }
    }
}
