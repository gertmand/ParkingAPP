using System;
using System.Text.Json.Serialization;

namespace API.Models.ParkingSpotDtos
{
    public class ParkingSpotDataResponse
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int ReserverAccountId { get; set; }
        public string? ReserverName { get; set; }
        public int ReservationId { get; set; }
        public int ReleasedId { get; set; }
        public int ParkingSpotId { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ParkingSpotStatusType Status { get; set; }
    }
}
