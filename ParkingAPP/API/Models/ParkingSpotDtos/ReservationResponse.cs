﻿using System;
using API.Models.Common;

namespace API.Models.ParkingSpotDtos
{
    public class ReservationResponse
    {
        public int? SpotAccountId { get; set; }
        public int ReserverAccountId { get; set; }
        public string ReserverName { get; set; }
        public int ParkingSpotId { get; set; }
        public int? ReleasedSpotId { get; set; }
        public int ParkingSpotNumber { get; set; }
        public string ParkingSpotOwner { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? DeletionDate { get; set; }
    }
}