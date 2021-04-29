using System;

namespace API.Models.ParkingSpotDtos
{
    public class ParkingSpotMainUserRequest
    {
        public int ParkingSpotId { get; set; }
        public int AccountId { get; set; }
        public bool CanBook { get; set; }
        public DateTime Created { get; set; }
    }
}
