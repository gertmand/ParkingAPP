using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.Common
{
    public class ParkingDateEntityData : UniqueEntityData
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? DeletionDate { get; set; }
    }
}