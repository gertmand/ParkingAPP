using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.AccountDtos
{
    public class EditAccountRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNr { get; set; }
    }
}
