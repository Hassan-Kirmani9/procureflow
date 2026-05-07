import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { User, UserDocument } from "./schemas/user.schema";
import { Model } from "mongoose";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt"
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {

        const existing = await this.userModel.findOne({ email: registerDto.email })
        if (existing) throw new ConflictException('EMAIL  ALREADY EXISTS!')
        const hashedPass = await bcrypt.hash(registerDto.password, 10)
        const user = await this.userModel.create({
            ...registerDto,
            password: hashedPass
        })

        const token = this.jwtService.sign({ sub: user._id, email: user.email, role: user.role })
        return { token, user: { id: user._id, email: user.email, role: user.role } }
    }
    async login(loginDto: LoginDto) {
        const user = await this.userModel.findOne({ email: loginDto.email })
        if (!user) throw new UnauthorizedException("INVALID CREDS")
        const isvalidPass = await bcrypt.compare(loginDto.password, user.password)
        if (!isvalidPass) throw new UnauthorizedException("INVALID CREDS")
        if (!user.isActive) throw new UnauthorizedException("ACC IS NOT ACTIVE")

        const token = this.jwtService.sign({ sub: user._id, email: user.email, role: user.role })
        return { token, user: { id: user._id, email: user.email, role: user.role } }

    }

}