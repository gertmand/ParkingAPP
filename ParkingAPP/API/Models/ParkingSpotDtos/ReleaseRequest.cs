using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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