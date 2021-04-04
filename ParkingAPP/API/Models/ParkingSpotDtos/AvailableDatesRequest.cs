using System;

namespace API.Models.ParkingSpotDtos
{
    public class AvailableDatesRequest
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}