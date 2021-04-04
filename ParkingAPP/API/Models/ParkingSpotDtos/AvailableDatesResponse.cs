using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.ParkingSpotDtos
{
    public class AvailableDatesResponse
    {
        public int ParkingSpotId { get; set; }
        public int? ReleasedSpotId { get; set; }
        public int Days { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}