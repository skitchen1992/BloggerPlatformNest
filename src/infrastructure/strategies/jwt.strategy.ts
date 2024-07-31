import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { appSettings } from '@settings/app-settings';
import { UsersQueryRepository } from '@features/users/infrastructure/users.query-repository';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected readonly usersQueryRepository: UsersQueryRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appSettings.api.JWT_SECRET_KEY,
      passReqToCallback: true, // Позволяет передать объект request в метод validate
    });
  }

  async validate(request: Request, payload: any) {
    return (request.currentUser = await this.usersQueryRepository.getById(
      payload.userId,
    ));
  }
}
