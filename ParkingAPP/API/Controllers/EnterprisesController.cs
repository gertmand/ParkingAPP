using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Models.AccountDtos;
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
        private readonly ILogService _logService;
        private readonly IAccountService _accountService;
        private readonly IMapper _mapper;
        [System.Obsolete]
        private readonly IHostingEnvironment hostEnvironment;

        [System.Obsolete]
        public EnterprisesController(IEnterpriseService enterpriseService, IParkingSpotService parkingSpotService, IAccountService accountService, IMapper mapper, IHostingEnvironment environment, ILogService logService)
        {
            _enterpriseService = enterpriseService;
            _parkingSpotService = parkingSpotService;
            _accountService = accountService;
            _logService = logService;
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

        [HttpGet("invitations/{email}")]
        public ActionResult<IEnumerable<EnterpriseInvitationResponse>> GetUserInvitations(string email)
        {
            if (Account == null)
            {
                return Unauthorized();

            }

            return null; //_enterpriseService.GetUserInvitations(email).ToList();
        }

        [HttpPost("add")]
        public ActionResult Create(EnterpriseCreateRequest request)
        {
            _enterpriseService.Create(request);
            return Ok(new { message = "Asutus lisatud, saate nüüd asutust kasutada" });
        }


        // Validate methods for client
        [HttpGet("{enterpriseId}/validatephonenumber/{phoneNumber}")]
        public bool ValidatePhoneNumber(string phoneNumber)
        { 
            return _enterpriseService.ValidatePhoneNumber(phoneNumber);
        }

        [HttpGet("{enterpriseId}/validatecarnumber/{carNr}")]
        public string ValidateCarNumber(string carNr, int enterpriseId)
        {
            return _enterpriseService.ValidateCarNumber(carNr, enterpriseId);
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

            return _parkingSpotService.ReleaseParkingSpot(Account.Id, request);
        }

        [HttpPost("reservation")]
        public ActionResult<ReservationResponse> PostReservation(ReservationRequest request)
        {
            if (Account == null)
            {
                return Unauthorized();
            }

            var response = _parkingSpotService.ReserveParkingSpot(Account.Id, request);

            return response;
        }

        [HttpPost("{enterpriseId}/available-dates")]
        public ActionResult<IEnumerable<AvailableDatesResponse>> GetAvailableDatesForReservation(AvailableDatesRequest request, int enterpriseId)
        {
            if (Account == null)
            {
                return Unauthorized();
            }

            return _parkingSpotService.GetAvailableDatesForReservation(request, enterpriseId, Account.Id).OrderBy(x => x.StartDate).ToList();
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
            foreach (var user in enterpriseUsers)
            {
                user.AccountCars = _accountService.GetCarsByAccountId(user.Id);
            }
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

        [HttpGet("{enterpriseId}/admin/parkingspots/mainusers")]
        public ActionResult<IEnumerable<ParkingSpotMainUserResponse>> GetEnterpriseParkingSpotsMainUsers(int enterpriseId)
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

            return _parkingSpotService.GetParkingSpotsMainUsers(enterpriseId).ToList();
        }

        [HttpPost("{enterpriseId}/admin/parkingspots/mainusers/{accountId}/canBook")]
        public ActionResult<bool> ChangeCanBookStatus(int enterpriseId, int accountId)
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

            return _enterpriseService.ChangeCanBookStatus(Account.Id, enterpriseId,accountId);
        }

        [HttpPost("{enterpriseId}/admin/parkingspots/add")]
        public ActionResult<ParkingSpotResponse> AddParkingSpot(ParkingSpotRequest request,int enterpriseId)
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
            return _parkingSpotService.AddParkingSpot(Account.Id, request, enterpriseId);
        }

        [HttpPost("{enterpriseId}/admin/parkingspots/addcollection")]
        public IActionResult AddParkingSpotArray(ParkingSpotRequest[] request,int  enterpriseId)
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
            _parkingSpotService.AddParkingSpotArray(Account.Id, request, enterpriseId);
            return Ok("Kohad lisatud.");
        }

        [HttpPost("{enterpriseId}/admin/parkingspots/adduser")] 
        public ActionResult<ParkingSpotMainUserResponse> AddParkingSpotMainUser(ParkingSpotMainUserRequest request, int enterpriseId)
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
            return _parkingSpotService.AddParkingSpotMainUser(Account.Id, request);
        }
        
        [HttpPost("{enterpriseId}/admin/addparkinglotplan")]
        [System.Obsolete]
        public ActionResult<EnterpriseResponse> AddParkingLotPlan([FromForm] Enterprise e, int enterpriseId)
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
            if (HttpContext.Request.Form.Files.Any())
            {
                var file = HttpContext.Request.Form.Files[0];
                string path = hostEnvironment.ContentRootPath.Substring(0, (hostEnvironment.ContentRootPath.Length - 14)) + "reactApp\\public\\images\\" + "Enterprise_" + enterpriseId + ".jpg";
                FileStream fileStream = new FileStream(path, FileMode.OpenOrCreate, FileAccess.ReadWrite);
                file.CopyTo(fileStream);
                fileStream.Dispose();
            }

            return Ok();
        }

        [HttpPost("{enterpriseId}/admin/parkingspots/{id}/delete")]
        public ActionResult<ParkingSpotResponse> DeleteParkingSpot(int enterpriseId, int id)
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
            _parkingSpotService.DeleteParkingSpot(Account.Id, id);
            return Ok(_parkingSpotService.GetById(id));
        }

        [HttpPost("{enterpriseId}/admin/parkingspots/{parkingSpotId}/user/{accountId}/delete")]
        public ActionResult<ParkingSpotMainUserResponse> DeleteParkingSpotMainUser(int enterpriseId, int accountId, int parkingSpotId)
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
            _parkingSpotService.DeleteParkingSpotMainUser(Account.Id, accountId, parkingSpotId);
            return Ok();
        }

        [HttpPost("{enterpriseId}/admin/users/{accountId}")]
        public ActionResult<AccountResponse> GetUserData(int enterpriseId, int accountId)
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

            var cars = _accountService.GetCarsByAccountId(accountId);
            var user = _enterpriseService.GetUserData(accountId);
            user.AccountCars = cars;
            return user;
        }

        [HttpGet("{enterpriseId}/user/{userId}")]
        public ActionResult<EnterpriseUserDataResponse> GetEnterpriseUserDataAdmin(int enterpriseId, int userId)
        {
            if (Account == null)
            {
                return Unauthorized();
            }

            if (!_enterpriseService.CheckUserEnterprise(Account.Id, enterpriseId))
            {
                return BadRequest(new { type = "Unauthorized", message = "Enterprise not found" });
            }

            var reservations = _parkingSpotService.GetUserReservations(enterpriseId, userId);
            var parkingSpot = _parkingSpotService.GetUserParkingSpot(enterpriseId, userId);
            var isAdmin = _enterpriseService.GetEnterpriseAdmin(enterpriseId, userId);
            var canBook = _enterpriseService.GetEnterpriseData(enterpriseId, userId);

            if (parkingSpot != null)
                parkingSpot.Status = _parkingSpotService.GetParkingSpotStatus(parkingSpot.Id);

            var userData = new EnterpriseUserDataResponse
            {
                ParkingSpot = parkingSpot,
                Reservations = reservations,
                IsAdmin = isAdmin,
                CanBook = canBook
            };

            return userData;
        }

        [HttpGet("{enterpriseId}/spot/{userId}")]
        public ActionResult<EnterpriseParkingSpotDataResponse> GetEnterpriseParkingSpotData(int enterpriseId, int userId)
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
                .GetUserParkingSpot(enterpriseId, userId)?.Id;

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

        // LOGS METHODS

        [HttpGet("{enterpriseId}/logs")]
        public ActionResult<IEnumerable<Log>> GetEnterpriseLogs(int enterpriseId)
        {
            if (Account == null)
            {
                return Unauthorized();

            }

            if (!_enterpriseService.CheckUserEnterprise(Account.Id, enterpriseId))
            {
                return BadRequest(new { type = "Unauthorized", message = "Enterprise not found" });
            }

            return _logService.GetEnterpriseLogs(enterpriseId).ToList();
        }

        [HttpGet("{enterpriseId}/userlogs/{userId}")]
        public ActionResult<IEnumerable<Log>> GetUserLogs(int userId, int enterpriseId)
        {
            if (Account == null)
            {
                return Unauthorized();

            }

            if (!_enterpriseService.CheckUserEnterprise(Account.Id, enterpriseId))
            {
                return BadRequest(new { type = "Unauthorized", message = "Enterprise not found" });
            }

            return _logService.GetUserLogs(userId).ToList();
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