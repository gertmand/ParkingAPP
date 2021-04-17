export type Enterprise = {
    id: number,
    name: string,
    description: string,
    enterpriseType: EnterpriseType,
    active: boolean
}

export enum EnterpriseType {
    Business,
    School,
    Appartment
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
    status: string
}

export type ParkingSpotRequest = {
    number : number
}

export type ParkingSpotMainUserResponse = {
    parkingSpotId : number,
    accountId: number,
    mainUserFullName : string,
    canBook: boolean,
    enterpriseId: number
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

