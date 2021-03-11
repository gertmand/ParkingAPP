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
    parkingSpaceNumber?: number,
    parkingSpaceOwner?: string
}

export type ReservationRequest = {
    startDate: Date,
    endDate: Date,
    userId: number,
    parkingSpotId: number
}

export type ParkingSpot = {
    id: number,
    created: Date,
    updated: Date,
    deletionDate?: Date,
    number: Number,
    status: string
}