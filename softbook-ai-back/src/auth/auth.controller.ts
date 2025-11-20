import { Controller, Request, Post, UseGuards, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() req) {
        // Ideally use a DTO and validate, but for now we'll do manual validation in service or use LocalGuard
        // Implementing simple direct call for simplicity with the provided credentials
        const user = await this.authService.validateUser(req.email, req.password);
        if (!user) {
            return { statusCode: 401, message: 'Unauthorized' };
        }
        return this.authService.login(user);
    }
}
