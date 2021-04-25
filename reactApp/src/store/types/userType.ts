export type User = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    created: Date,
    isVerified: boolean,
    jwtToken: string,
    role: string,
    title: string,
    phoneNr: string,
    avatar: string,
    accountCars: Car[]
}

export type SelectedUser = {
    id: number,
    userId: number,
    firstName: string,
    lastName: string,
    email: string
}

export type Car = {
    id?: number,
    regNr: string,
    temporary?: boolean
}

export type RegisterUser = {
    title: string,
    firstName:string,
    lastName:string,
    email:string,
    password: string,
    confirmPassword: string,
    acceptTerms: boolean,
}