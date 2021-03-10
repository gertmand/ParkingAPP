using API.Models.Common;

namespace API.Models.ParkingSpotDtos
{
    public class ParkingSpotResponse : DateEntityData
    {
        public int Number { get; set; }
        public string Status { get; set; } // ACTIVE, RELEASED, RESERVED
    }
}