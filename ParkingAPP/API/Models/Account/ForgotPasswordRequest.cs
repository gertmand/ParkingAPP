using System.ComponentModel.DataAnnotations;

namespace API.Models.Account
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}