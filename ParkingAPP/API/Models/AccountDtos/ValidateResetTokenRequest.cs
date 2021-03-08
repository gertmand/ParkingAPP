using System.ComponentModel.DataAnnotations;

namespace API.Models.AccountDtos
{
    public class ValidateResetTokenRequest
    {
        [Required]
        public string Token { get; set; }
    }
}