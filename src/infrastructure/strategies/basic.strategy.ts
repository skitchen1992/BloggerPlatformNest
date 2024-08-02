import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
import { appSettings } from '@settings/app-settings';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  public validate = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    if (
      appSettings.api.ADMIN_AUTH_USERNAME === username &&
      appSettings.api.ADMIN_AUTH_PASSWORD === password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
