using System.ComponentModel.DataAnnotations;

namespace API.Models.Account
{
    public class VerifyEmailRequest
    {
        [Required]
        public string Token { get; set; }
    }
}