import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersQueryRepository } from '@features/users/infrastructure/users.query-repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

// Custom guard
// https://docs.nestjs.com/guards
@Injectable()
export class BearerAuthGuard implements CanActivate {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const { userId } =
        ((await this.jwtService.verifyAsync(token)) as JwtPayload) ?? {};

      request.currentUser = await this.usersQueryRepository.getById(userId);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
