using System;
using System.Collections.Generic;
using API.Models.Entities;
using API.Models.ParkingSpotDtos;

namespace API.Models.EnterpriseDtos
{
    public class EnterpriseUserDataResponse
    {
        public ParkingSpotResponse? ParkingSpot { get; set; }
        public IEnumerable<ReservationResponse>? Reservations { get; set; }

        public bool? IsAdmin { get; set; }
    }
}