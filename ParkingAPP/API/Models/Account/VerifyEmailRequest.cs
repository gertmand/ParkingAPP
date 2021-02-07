using System.ComponentModel.DataAnnotations;

namespace MinuRaha.Models.Accounts
{
    public class VerifyEmailRequest
    {
        [Required]
        public string Token { get; set; }
    }
}