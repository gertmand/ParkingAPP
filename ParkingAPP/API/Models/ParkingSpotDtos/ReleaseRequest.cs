using System;

namespace API.Models.ParkingSpotDtos
{
    public class ReleaseRequest
    {
        public int ParkingSpaceId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int EnterpriseId { get; set; }
    }
}