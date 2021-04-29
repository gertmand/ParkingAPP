using System.Text.Json.Serialization;
using API.Models.Common;

namespace API.Models.ParkingSpotDtos
{
    public class ParkingSpotResponse : DateEntityData
    {
        public int Number { get; set; }

        public string Staatus { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ParkingSpotStatusType Status { get; set; }
    }
}