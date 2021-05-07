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
    //id : number,
    enterpriseId: number,
    email: string,
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
    days: number,
    startDate: Date,
    endDate: Date,
    checked: boolean
}

export type AvailableDates = {
    id: number,
    parkingSpotNumber: number,
    days: number,
    startDate: Date,
    endDate: Date,
}

const enterpriseType = () => {

}

export default enterpriseType