using System.ComponentModel.DataAnnotations;

namespace API.Models.AccountDtos
{
    public class VerifyEmailRequest
    {
        [Required]
        public string Token { get; set; }
    }
}