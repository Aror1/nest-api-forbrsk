import {
  Controller,
  Res,
  Post,
  Get,
  Delete,
  Put,
  Body,
  UnauthorizedException,
  BadRequestException,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import type { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from './auth.jwt-auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
  return {
    user_id: req.user.user_id,    
    user_login: req.user.login,
  };
}

  @Post('login')
  async login(@Res({ passthrough: true }) res: Response, @Body() body: any) {
    const { login, password } = body;
    if (!login || !password) {
      throw new BadRequestException('login and password are required');
    }
    const user = await this.authService.validateUser(login, password);

    if (!user) {
      throw new UnauthorizedException('invalid');
    }

    const token = await this.authService.login(user);

    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 3600000,
    });

    return token;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { success: true };
  }
}
