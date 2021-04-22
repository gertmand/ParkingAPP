using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.ParkingSpotDtos
{
    public class ParkingSpotRequest
    {
        public int Number { get; set; }
        public int EnterpriseId { get; set; }

    }
}
