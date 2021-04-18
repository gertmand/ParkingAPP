using System;
using API.Models.Entities;

namespace API.Models.JoinedEntities
{
    public class ParkingSpotAccount
    {
        public int ParkingSpotId { get; set; }
        public int AccountId { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Deleted { get; set; }

        public ParkingSpot ParkingSpot { get; set; }
        public Account Account { get; set; }
    }
}