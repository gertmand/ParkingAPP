using System;
using System.Collections.Generic;

namespace API.Models.AccountDtos
{
    public class AccountResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }
        public bool IsVerified { get; set; }
        public string Avatar { get; set; }
        public string PhoneNr { get; set; }
        public IEnumerable<CarResponse>? AccountCars { get; set; }
    }
}