using System.Text.Json.Serialization;
using API.Models.Common;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace API.Models.ParkingSpotDtos
{
    public class ParkingSpotResponse : DateEntityData
    {
        public int Number { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ParkingSpotStatusType Status { get; set; }
    }
}