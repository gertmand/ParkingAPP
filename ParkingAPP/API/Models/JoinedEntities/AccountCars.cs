using System.Text.Json.Serialization;
using API.Models.Entities;

namespace API.Models.JoinedEntities
{
    public class AccountCars
    {
        public int AccountId { get; set; }
        public int CarId { get; set; }

        [JsonIgnore]
        public virtual Account Account { get; set; }
        [JsonIgnore]
        public virtual Car Car { get; set; }
    }
}
