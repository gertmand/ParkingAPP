﻿using System.Collections.Generic;
using API.Models.AccountDtos;

namespace API.Models.EnterpriseDtos
{
    public class EnterpriseAccountsResponse
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? Avatar { get; set; }
        public string PhoneNr { get; set; }
        public IEnumerable<CarResponse> AccountCars { get; set; }
    }
}