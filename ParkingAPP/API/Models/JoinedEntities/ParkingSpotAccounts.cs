using API.Models.Entities;

namespace API.Models.JoinedEntities
{
    public class ParkingSpotAccounts
    {
        public int ParkingSpotId { get; set; }
        public int AccountId { get; set; }

        public ParkingSpot ParkingSpot { get; set; }
        public Account Account { get; set; }
    }
}