using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using API.Models.Entities;

namespace API.Models.ParkingSpotDtos
{
    public class AvailableDatesResponse
    {
        public int Id { get; set; }
        public int ParkingSpotNumber { get; set; }
        public int Days { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        [JsonIgnore]
        public ParkingSpot ParkingSpot { get; set; }
    }
}