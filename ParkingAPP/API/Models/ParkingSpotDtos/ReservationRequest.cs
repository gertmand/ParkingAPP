using System;

namespace API.Models.ParkingSpotDtos
{
    public class ReservationRequest
    {
        public int ReserverAccountId{ get; set; }
        public int ParkingSpotId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}