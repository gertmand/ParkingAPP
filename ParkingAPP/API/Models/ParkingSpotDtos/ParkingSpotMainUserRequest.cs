using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.ParkingSpotDtos
{
    public class ParkingSpotMainUserRequest
    {
        public int ParkingSpotId { get; set; }
        public int AccountId { get; set; }
    }
}
