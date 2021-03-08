using API.Models.Entities;

namespace API.Models.JoinedEntities
{
    public class EParkingSpotAccounts
    {
        public int EParkingSpotId { get; set; }
        public int EAccountId { get; set; }

        public EParkingSpot EParkingSpot { get; set; }
        public Account Account { get; set; }
    }
}