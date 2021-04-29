using System.Collections.Generic;
using System.Text.Json.Serialization;
using API.Models.JoinedEntities;

namespace API.Models.Entities
{
    public class Car
    {
        public int Id { get; set; }
        public string RegNr { get; set; }

        public bool Temporary { get; set; }

        [JsonIgnore]
        public virtual ICollection<AccountCars> AccountCars { get; set; }
    }
}
