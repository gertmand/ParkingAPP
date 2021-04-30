using System.Collections.Generic;
using API.Models.AccountDtos;
using API.Models.JoinedEntities;

namespace API.Models.ParkingSpotDtos
{
    public class ParkingSpotMainUserResponse
    {
        public int ParkingSpotId { get; set; }
        public int AccountId { get; set; }
        public string MainUserFullName { get; set; }
        public int EnterpriseId { get; set; }
        public bool? CanBook { get; set; }
        public IEnumerable<CarResponse> AccountCars { get; set; }
    }
}
