using System;

namespace API.Models.Common
{
    public class ParkingDateEntityData : DateEntityData
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}