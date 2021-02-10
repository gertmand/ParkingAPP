using System.ComponentModel.DataAnnotations;

namespace API.Models.Account
{
    public class ValidateResetTokenRequest
    {
        [Required]
        public string Token { get; set; }
    }
}