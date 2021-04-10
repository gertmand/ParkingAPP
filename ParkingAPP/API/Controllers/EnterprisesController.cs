using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Models.EnterpriseDtos;
using API.Models.Entities;
using API.Models.ParkingSpotDtos;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnterprisesController : BaseController
    {
        private readonly IEnterpriseService _enterpriseService;
        private readonly IParkingSpotService _parkingSpotService;
        private readonly IMapper _mapper;
        private IHostingEnvironment hostEnvironment;

        public EnterprisesController(IEnterpriseService enterpriseService, IParkingSpotService parkingSpotService, IMapper mapper, IHostingEnvironment environment)
        {
            _enterpriseService = enterpriseService;
            _parkingSpotService = parkingSpotService;
            _mapper = mapper;
            hostEnvironment = environment;

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
        public List<EnterpriseAccountsResponse> GetUsersWithoutParkingSpace(int enterpriseId)
        {
            CheckUser(enterpriseId);

            var regularUsers = _enterpriseService.GetEnterpriseAccountsWithoutParkingspots(enterpriseId);

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
        [HttpPost("{id}/addparkinglotplan")]
        public ActionResult<EnterpriseResponse> AddParkingLotPlan([FromForm] Enterprise e, int id)
        {
            
            if (HttpContext.Request.Form.Files.Any())
            {
                var file = HttpContext.Request.Form.Files[0];
                string path = hostEnvironment.ContentRootPath.Substring(0,(hostEnvironment.ContentRootPath.Length - 14))+"reactApp\\public\\images\\" + "Enterprise_" + id + ".jpg";
                FileStream fileStream = new FileStream(path, FileMode.OpenOrCreate, FileAccess.ReadWrite);
                fileStream.Dispose();
            }

            return _mapper.Map<EnterpriseResponse>(_enterpriseService.GetById(id));
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

        [HttpPost("parkingspots/{id}")]
        public ActionResult<ParkingSpotResponse> DeleteParkingSpot(int id)
        {
            _parkingSpotService.DeleteParkingSpot(id);
            return Ok(_parkingSpotService.GetById(id));
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

        // ADMIN METHODS

        [HttpGet("{enterpriseId}/admin/users")]
        public ActionResult<IEnumerable<EnterpriseAccountsResponse>> GetEnterpriseUsers(int enterpriseId)
        {
            if (Account == null)
            {
                return Unauthorized();

            }

            if (!_enterpriseService.CheckUserEnterprise(Account.Id, enterpriseId))
            {
                return BadRequest(new { type = "Unauthorized", message = "Enterprise not found" });
            }

            if (_enterpriseService.GetEnterpriseAdmin(enterpriseId, Account.Id) == false)
            {
                return Unauthorized();
            }

            var enterpriseUsers = _enterpriseService.GetEnterpriseAccounts(enterpriseId);

            return enterpriseUsers.ToList();
        }


        [HttpGet("{enterpriseId}/admin/parkingspots")]
        public ActionResult<IEnumerable<ParkingSpotResponse>> GetEnterpriseParkingSpots(int enterpriseId)
        {


            if (Account == null)
            {
                return Unauthorized();
            }

            if (!_enterpriseService.CheckUserEnterprise(Account.Id, enterpriseId))
            {
                return BadRequest(new { type = "Unauthorized", message = "Enterprise not found" });
            }

            if (_enterpriseService.GetEnterpriseAdmin(enterpriseId, Account.Id) == false)
            {
                return Unauthorized();
            }


            var enterpriseParkingSpots = _parkingSpotService.GetAll(enterpriseId);

            return enterpriseParkingSpots.ToList();
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