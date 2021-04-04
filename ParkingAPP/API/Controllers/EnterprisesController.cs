using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models.EnterpriseDtos;
using API.Models.Entities;
using API.Models.ParkingSpotDtos;
using API.Services;
using AutoMapper;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnterprisesController : BaseController
    {
        private readonly IEnterpriseService _enterpriseService;
        private readonly IParkingSpotService _parkingSpotService;
        private readonly IMapper _mapper;

        public EnterprisesController(IEnterpriseService enterpriseService, IParkingSpotService parkingSpotService, IMapper mapper)
        {
            _enterpriseService = enterpriseService;
            _parkingSpotService = parkingSpotService;
            _mapper = mapper;
        }

        // ENTERPRISE METHODS

        [HttpGet("{id}")]
        public ActionResult<EnterpriseResponse> GetEnterprise(int id)
        {
            if (Account == null)
            {
                return Unauthorized();
            }

            if (!_enterpriseService.CheckUserEnterprise(Account.Id, id))
            {
                return BadRequest(new { type = "Unauthorized", message = "Enterprise not found" });
            }

            return Ok(_enterpriseService.GetById(id));
        }

        [HttpGet("user")]
        public ActionResult<IEnumerable<EnterpriseResponse>> GetUserEnterprises()
        {
            if (Account == null)
            {
                return BadRequest();
            }

            return Ok(_enterpriseService.GetAllByAccountId(Account.Id));
        }

        [HttpGet("{enterpriseId}/users")]
        public async Task<List<EnterpriseAccountsResponse>> GetUsersWithoutParkingSpace(int enterpriseId)
        {
            CheckUser(enterpriseId);

            var regularUsers = _enterpriseService.GetEnterpriseAccounts(enterpriseId);

            return regularUsers.ToList();
        }

        [HttpGet("{enterpriseId}/user")]
        public ActionResult<EnterpriseUserDataResponse> GetEnterpriseUserData(int enterpriseId)
        {
            if (Account == null)
            {
                return Unauthorized();
            }

            if (!_enterpriseService.CheckUserEnterprise(Account.Id, enterpriseId))
            {
                return BadRequest(new { type = "Unauthorized", message = "Enterprise not found" });
            }

            var reservations = _parkingSpotService.GetUserReservations(enterpriseId, Account.Id);
            var parkingSpot = _parkingSpotService.GetUserParkingSpot(enterpriseId, Account.Id);
            var isAdmin = _enterpriseService.GetEnterpriseAdmin(enterpriseId, Account.Id);
            var canBook = _enterpriseService.GetEnterpriseData(enterpriseId, Account.Id);

            if(parkingSpot != null)
                parkingSpot.Status = _parkingSpotService.GetParkingSpotStatus(parkingSpot.Id);

            //_logService.AddLog("algatajaId", "secondaryUserId?" "type/enum", "desc", "changes: EMAIL1 -> EMAIL2", "CreatedAt")

            var userData = new EnterpriseUserDataResponse
            {
                ParkingSpot = parkingSpot,
                Reservations = reservations,
                IsAdmin = isAdmin,
                CanBook = canBook
            };

            return userData;
        }

        [HttpGet("{enterpriseId}/spot")]
        public ActionResult<EnterpriseParkingSpotDataResponse> GetEnterpriseParkingSpotData(int enterpriseId)
        {
            if (Account == null)
            {
                return Unauthorized();

            }

            if (!_enterpriseService.CheckUserEnterprise(Account.Id, enterpriseId))
            {
                return BadRequest(new { type = "Unauthorized", message = "Enterprise not found" });
            }

            var spotId = _parkingSpotService
                .GetUserParkingSpot(enterpriseId, Account.Id)?.Id;

            if (spotId == null || spotId == 0)
            {
                return Ok();
            }

            var spotListData =
                _parkingSpotService.GetParkingSpotListData(spotId.Value);

            var spotData = new EnterpriseParkingSpotDataResponse()
            {
                SpotListData = spotListData,
            };

            return spotData;
        }

        // PARKING METHODS (PARKING, RESERVATION, RELEASE)

        [HttpGet("reservation")]
        public ActionResult<IEnumerable<Reservation>> GetReservations()
        {
            return Ok(_enterpriseService.GetReservations());
        }

        [HttpPost("release")]
        public ActionResult<ReleasedResponse> ReleaseSpot(ReleaseRequest request)
        {
            if (Account == null)
            {
                return Unauthorized();
            }

            if (!_enterpriseService.CheckUserEnterprise(Account.Id, request.EnterpriseId))
            {
                return BadRequest(new { type = "Unauthorized", message = "Enterprise not found" });
            }

            return _parkingSpotService.ReleaseParkingSpot(request);
        }

        [HttpPost("reservation")]
        public ActionResult<ReservationResponse> PostReservation(ReservationRequest request)
        {
            var response = _parkingSpotService.ReserveParkingSpot(request);

            return response;
        }

        [HttpGet("available-dates")]
        public ActionResult<IEnumerable<AvailableDatesResponse>> GetAvailableDatesForReservation(AvailableDatesRequest request)
        {
            if (Account == null)
            {
                return Unauthorized();
            }

            return _parkingSpotService.GetAvailableDatesForReservation(request).OrderByDescending(x => x.Days).ToList();
        }

        // HELPER METHODS

            private ActionResult<bool> CheckUser(int enterpriseId)
        {
            if (Account == null)
            {
                return Unauthorized();

            }

            if (!_enterpriseService.CheckUserEnterprise(Account.Id, enterpriseId))
            {
                return BadRequest(new { type = "Unauthorized", message = "Enterprise not found" });
            }

            return true;
        }
    }
}