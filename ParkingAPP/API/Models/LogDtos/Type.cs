using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.LogDtos
{
    public enum Type
    {
        CarAdd,
        CarDelete,
        UserEdit,
        UserRegister,
        UserCanBook,
        EnterpriseRegister,
        ReleaseParkingSpot,
        ReserveParkingSpot,
        AddParkingSpot,
        DeleteParkingSpot,
        AddParkingSpotMainUser,
        DeleteParkingSpotMainUser,
        UserInvitation,
        UserDeleteFromEnterprise
    }
}
