using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.AccountDtos
{
    public class CarResponse
    {
        public int Id { get; set; }
        public string RegNr { get; set; }

        public string Temporary { get; set; }
    }
}
