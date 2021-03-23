using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models.ParkingSpotDtos;

namespace API.Models.EnterpriseDtos
{
    public class EnterpriseParkingSpotDataResponse
    {
        public IEnumerable<ParkingSpotDataResponse>? SpotListData { get; set; }
    }
}
