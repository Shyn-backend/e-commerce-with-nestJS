/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, UseGuards,  } from '@nestjs/common';
import { UserService } from 'src/shared/user.service';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { Payload } from '../types/payload';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/guards/admin.guards';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('signUp-signIn')
@Controller('auth')
export class AuthController {
    constructor(private userService:UserService,
        private authService:AuthService){}

    @Post('login')
    async login(@Body() userDTO : LoginDTO){
        const user = await this.userService.findByLogin(userDTO);
        const payload: Payload = {
          email: user.email,
          isAdmin: user.isAdmin
        };
        const token = await this.authService.signPayload(payload);
        return { user, token };
    }

    @Post('register')
    async registertionUser(@Body() userDTO:RegisterDTO) {
        const user = await this.userService.create(userDTO);
        const payload: Payload = {
            email: user.email,
            isAdmin: user.isAdmin
          };
          const token = await this.authService.signPayload(payload);
          return { user, token };

    }

    @Get('getUsers')
    @UseGuards(AuthGuard('jwt') , AdminGuard)
    async getUsers(){
        const users = this.userService.findAllusers();
        return users;
    }

}