import { UserRole } from "../schemas/user.schema"

export class RegisterDto {
    name: string
    email: string
    password: string
    role?: UserRole

}