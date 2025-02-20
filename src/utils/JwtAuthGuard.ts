/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    console.log('Token:', token);
    if (!token) {
      console.log('No token found');
      throw new UnauthorizedException('No token found');
    }

    try {
      const decoded = this.jwtService.verify(token);
      // request.user = decoded;
      request.user = { ...decoded, sub: decoded.sub };
      console.log('Decoded token:', decoded);
      return true;
    } catch (err) {
      console.log('Token verification failed', err);
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
