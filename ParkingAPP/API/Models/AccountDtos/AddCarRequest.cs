using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.AccountDtos
{
    public class AddCarRequest
    {
        public string RegNr { get; set; }

        public bool Temporary { get; set; }
    }
}
