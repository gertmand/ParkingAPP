using API.Models.Common;

namespace API.Models.ParkingSpotDtos
{
    public class ReservationResponse : ParkingDateEntityData
    {
        public int SpotAccountId { get; set; }
        public int ReserverAccountId { get; set; }
        public int ParkingSpotId { get; set; }
        public int? ReleasedSpotId { get; set; }
        public int ParkingSpotNumber { get; set; }
        public string ParkingSpotOwner { get; set; }
    }
}