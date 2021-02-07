using System.ComponentModel.DataAnnotations;

namespace MinuRaha.Models.Accounts
{
    public class ValidateResetTokenRequest
    {
        [Required]
        public string Token { get; set; }
    }
}