using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models.Common;

namespace API.Models.Entities
{
    public class Reservation : ParkingDateEntityData
    {
        public int SpotAccountId { get; set; }
        public int ReserverAccountId { get; set; }
        public int ParkingSpotId { get; set; }
        public int? ReleasedSpotId { get; set; }

        public virtual Account SpotAccount { get; set; }
        public virtual Account ReserverAccount { get; set; }
        public virtual ParkingSpot ParkingSpot { get; set; }
        public virtual ReleasedSpot? ReleasedSpot { get; set; }
    }
}