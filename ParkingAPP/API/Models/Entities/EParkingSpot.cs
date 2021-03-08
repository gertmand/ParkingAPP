using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.Entities
{
    public class EParkingSpot
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public DateTime? Created { get; set; }
        public int EnterpriseId { get; set; }

        public Enterprise Enterprise { get; set; }
        public virtual ICollection<EParkingSpotAccounts> EParkingSpotAccounts { get; set; }
    }
}