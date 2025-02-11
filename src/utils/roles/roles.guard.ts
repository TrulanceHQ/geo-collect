/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new ForbiddenException('No token provided');
    }
    try {
      const user = this.jwtService.verify(token);
      request.user = user;
      if (!user.roles || !roles.some((role) => user.roles.includes(role))) {
        throw new ForbiddenException(
          'Acess Denied. You do not have the permission to this destination.',
        );
      }
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      } else if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    }
  }
}
