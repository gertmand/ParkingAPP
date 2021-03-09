using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models.Common;
using API.Models.JoinedEntities;

namespace API.Models.Entities
{
    public class ParkingSpot : DateEntityData
    {
        public int Number { get; set; }
        public int EnterpriseId { get; set; }

        public virtual Enterprise Enterprise { get; set; }
        public virtual ICollection<ParkingSpotAccounts> ParkingSpotAccounts { get; set; }
    }
}