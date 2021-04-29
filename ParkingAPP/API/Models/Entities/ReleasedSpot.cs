using API.Models.Common;

namespace API.Models.Entities
{
    public class ReleasedSpot : ParkingDateEntityData
    {
        public int ParkingSpotId {get; set; }

        public virtual ParkingSpot ParkingSpot { get; set; }
    }
}