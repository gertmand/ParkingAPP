using System.Collections.Generic;
using API.Models.Common;
using API.Models.JoinedEntities;

namespace API.Models.Entities
{
    public class ParkingSpot : DateEntityData
    {
        public int Number { get; set; }
        public int EnterpriseId { get; set; }

        public virtual Enterprise Enterprise { get; set; }
        public virtual ICollection<ParkingSpotAccount> ParkingSpotAccounts { get; set; }
    }
}