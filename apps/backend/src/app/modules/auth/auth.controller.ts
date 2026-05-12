import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Roles } from "./decorators/roles.decorator";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";

@Controller('auth')
export class AuthController {
    constructor(private authServices: AuthService) { }

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authServices.register(registerDto)
    }


    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authServices.login(loginDto)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('super_admin')
    @Get('test')
    test() {
        return { message: 'you are a super admin' }
    }
} 