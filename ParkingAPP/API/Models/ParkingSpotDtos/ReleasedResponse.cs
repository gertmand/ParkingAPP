using API.Models.Common;

namespace API.Models.ParkingSpotDtos
{
    public class ReleasedResponse : ParkingDateEntityData
    {
        public int ParkingSpotId { get; set; }
    }
}