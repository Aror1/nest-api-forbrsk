// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';
import { CreateUserDto } from 'src/users/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { RefreshToken } from './auth.refreshtoken.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async validateUser(login: string, password: string): Promise<any> {
    const user = await this.usersService.findByLogin(login);
    if (user && (await bcrypt.compare(password, user.user_pass))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { login: user.login, sub: user.id, role: user.role };

    const refresh_token = uuidv4();
    const token_hash = await bcrypt.hash(refresh_token, 10);

    const token_body: RefreshToken = {
      token_hash: token_hash,
      user_id: user.user_id,
      created_at: new Date(Date.now()),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    await this.refreshTokenRepository.save(token_body);

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refresh_token,
    };
  }

  async register(login: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userdto: CreateUserDto = {
      user_login: login,
      user_pass: hashedPassword,
    };
    return this.usersService.create(userdto);
  }
}
