using API.Models.Entities;

namespace API.Models.JoinedEntities
{
    public class EnterpriseAccount
    {
        public int AccountId { get; set; }
        public int EnterpriseId { get; set; }

        public Account Account { get; set; }
        public Enterprise Enterprise { get; set; }
    }
}
