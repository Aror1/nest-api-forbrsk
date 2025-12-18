import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const token = req.cookies?.access_token;
        return token;
      },
      secretOrKey: 'secret-key-for-jwt-brsk', 
    });
  }

  validate(payload: any) {
    console.log('VALID PAYLOAD:', payload);
    return payload;
  }
}