export type User = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    created: Date,
    isVerified: boolean,
    jwtToken: string,
    role: string,
    title: string
}