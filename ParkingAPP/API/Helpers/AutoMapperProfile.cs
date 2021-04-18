using API.Models.AccountDtos;
using API.Models.EnterpriseDtos;
using API.Models.Entities;
using API.Models.ParkingSpotDtos;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Routing.Constraints;
using Org.BouncyCastle.Math.EC.Rfc7748;

namespace API.Helpers
{
    public class AutoMapperProfile : Profile
    {
        // mappings between model and entity objects
        public AutoMapperProfile()
        {
            AllowNullDestinationValues = false;

            CreateMap<Account, AccountResponse>();

            CreateMap<Account, AuthenticateResponse>();

            CreateMap<Account, EnterpriseAccountsResponse>();

            CreateMap<RegisterRequest, Account>();

            CreateMap<CreateRequest, Account>();

            CreateMap<UpdateRequest, Account>()
                .ForAllMembers(x => x.Condition(
                    (src, dest, prop) =>
                    {
                        // ignore null & empty string properties
                        if (prop == null) return false;
                        if (prop.GetType() == typeof(string) && string.IsNullOrEmpty((string)prop)) return false;

                        // ignore null role
                        if (x.DestinationMember.Name == "Role" && src.Role == null) return false;

                        return true;
                    }
                ));

            CreateMap<Enterprise, EnterpriseResponse>();

            CreateMap<ParkingSpot, ParkingSpotResponse>();
                
            CreateMap<Reservation, ReservationResponse>()
                .ForMember(x => x.ReserverName, opt => opt.MapFrom(src => src.ReserverAccount.FirstName + " " + src.ReserverAccount.LastName))
                .ForMember(x => x.ParkingSpotOwner, opt => opt.MapFrom(src => src.SpotAccount.FirstName + " " + src.SpotAccount.LastName));

            CreateMap<ReleasedSpot, ReleasedResponse>();

            CreateMap<EnterpriseCreateRequest, Enterprise>();
        }
    }
}