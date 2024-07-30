import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { JwtService } from '@infrastructure/servises/jwt/jwt.service';
import { UsersQueryRepository } from '@features/users/infrastructure/users.query-repository';

// Custom guard
// https://docs.nestjs.com/guards
@Injectable()
export class BearerAuthGuard implements CanActivate {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader || authHeader.indexOf('Bearer ') === -1) {
      throw new UnauthorizedException();
    }

    const token = authHeader.slice(7);

    const { userId } = (this.jwtService.verifyToken(token) as JwtPayload) ?? {};

    if (!userId) {
      throw new UnauthorizedException();
    }

    request.user = await this.usersQueryRepository.getById(userId);
    return true;
  }
}
