using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models.Common;

namespace API.Models.ParkingSpotDtos
{
    public class ReleasedResponse : ParkingDateEntityData
    {
        public int ParkingSpotId { get; set; }
    }
}