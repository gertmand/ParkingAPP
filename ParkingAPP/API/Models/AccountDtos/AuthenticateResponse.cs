using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using API.Models.Entities;
using API.Models.JoinedEntities;

namespace API.Models.AccountDtos
{
    public class AuthenticateResponse
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
        public string JwtToken { get; set; }
        public string Avatar { get; set; }

        [JsonIgnore] // refresh token is returned in http only cookie
        public string RefreshToken { get; set; }
        public string PhoneNr { get; set; }
        public IEnumerable<Car>? AccountCars { get; set; }

    }
}