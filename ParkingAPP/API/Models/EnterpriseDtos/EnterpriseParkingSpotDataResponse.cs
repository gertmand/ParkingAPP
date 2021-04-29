using System.Collections.Generic;
using API.Models.ParkingSpotDtos;

namespace API.Models.EnterpriseDtos
{
    public class EnterpriseParkingSpotDataResponse
    {
        public IEnumerable<ParkingSpotDataResponse>? SpotListData { get; set; }
    }
}
