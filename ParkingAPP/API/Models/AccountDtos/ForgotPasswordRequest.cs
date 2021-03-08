using System.ComponentModel.DataAnnotations;

namespace API.Models.AccountDtos
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}