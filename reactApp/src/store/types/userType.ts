export type User = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    departmentId: number
}

export type RegularUser = {
    id: number,
    userId: number,
    firstName: string,
    lastName: string,
}

export type ParkingSpaceMainUser = {
    id?: number,
    startDate: Date,
    endDate: Date,
    userId : number,
    parkingSpaceId: number,
}

export type ParkingSpaceMainUserFullData = {
    id: number,
    startDate: Date,
    endDate: Date,
    userId : number,
    parkingSpaceId: number,
    parkingSpaceNumber: number,
    userCars: string,
    parkingSpaceMainUserId: number
}
