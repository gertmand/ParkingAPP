import { Car } from "./userType"

export type Enterprise = {
    id: number,
    name: string,
    description: string,
    enterpriseType: EnterpriseType,
    active: boolean
}


export enum EnterpriseType {
  Ettevõte ,
  Kool ,
  Ühistu ,
}

export type EnterpriseAddRequest = {
    name: string,
    description: string,
    type: EnterpriseType,
    acceptTerms: boolean,
    userId: number
}

// Enterprise User Data

export type EnterpriseUserData = {
    reservations?: Reservation[],
    parkingSpot?: ParkingSpot
}

export type Reservation = {
    id: number,
    startDate: Date,
    endDate: Date,
    deletionDate?: Date
    spotAccountId: number,
    reserverAccountId: number,
    releasedSpotId: number,
    parkingSpotId: number,
    parkingSpotNumber?: number,
    parkingSpotOwner?: string,
    reserverName?: string,
}

export type ReservationRequest = {
    startDate: Date,
    endDate: Date,
    reserverAccountId: number,
    parkingSpotId: number
}

export type EnterpriseInvitationResponse = {
    invitationId : number,
    enterpriseId: number,
    email: string,
    type: EnterpriseType,
    enterpriseName:string
}

export type EnterpriseInvitationRequest = {
    enterpriseId: number,
    userId: number,
    email: string,
    approved: boolean,
}

export type EnterpriseAccountRequest = {
    enterpriseId:number,
    userId: number
}


// Enterprise ParkingSpot Data

export type EnterpriseParkingSpotData = {
    spotListData: ParkingSpotListData[]
}

export type ParkingSpotListData = {
    id: number,
    status: string,
    startDate: Date,
    endDate: Date,
    reserverAccountId: number,
    reserverName: string,
    reservationId: number,
    releasedId: number,
    parkingSpotId: number
}

export type ParkingSpot = {
    id: number,
    created: Date,
    updated: Date,
    deletionDate?: Date,
    number: number,
    status: string,
    staatus: string
}

export type ParkingSpotRequest = {
    number : number
}

export type ParkingSpotMainUserResponse = {
    parkingSpotId : number,
    accountId: number,
    mainUserFullName : string,
    canBook: boolean,
    enterpriseId: number,
    accountCars: Car[]
}

export type ParkingSpotMainUserRequest = {
    parkingSpotId: number,
    accountId : number,
    canBook :boolean,
}

export type ReleaseRequest = {
    parkingSpaceId: number,
    startDate: Date,
    endDate: Date,
    enterpriseId: number
}

export type AvailableDatesResponse = {
    id: number,
    parkingSpotNumber: number,
    parkingSpotId: number,
    releasedSpotId: number,
    days: number,
    startDate: Date,
    endDate: Date,
    checked: boolean
}

export type AvailableDates = {
    id: number,
    parkingSpotNumber: number,
    parkingSpotId: number,
    releasedSpotId: number,
    days: number,
    startDate: Date,
    endDate: Date,
}

// export type ParkingTableData = {
//     spotId?: number,
//     reservationId?: number,
//     type: string,
//     startDate: Date,
//     endDate: Date,
//     user: string,
// }

export enum LogType {
    CarAdd,
    CarDelete,
    UserEdit,
    UserRegister,
    UserCanBook,
    EnterpriseRegister,
    ReleaseParkingSpot,
    ReserveParkingSpot,
    AddParkingSpot,
    DeleteParkingSpot
  }

export type Log = {
    id: number,
    createdAt: Date,
    description: string,
    type: LogType,
    accountId: number,
    toAccountId?: number,
    adminId?: number,
    enterpriseId?: number
}

export type UserInvitationRequest = {
    email: string
}

const enterpriseType = () => {

}
export default enterpriseType