namespace API.Models.Entities
{
    public class EParkingSpotAccounts
    {
        public int EParkingSpotId { get; set; }
        public int EAccountId { get; set; }

        public EParkingSpot EParkingSpot { get; set; }
        public Account Account { get; set; }
    }
}