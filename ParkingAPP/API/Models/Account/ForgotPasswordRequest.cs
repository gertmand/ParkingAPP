using System.ComponentModel.DataAnnotations;

namespace MinuRaha.Models.Accounts
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}