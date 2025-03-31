
import {AuthenticationStrategy} from '@loopback/authentication';
import {injectable, inject} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {JWTService} from '../services/jwt-service';

@injectable()
export class JWTStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject('services.JWTService') private jwtService: JWTService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new HttpErrors.Unauthorized('Authorization header missing');
    }

    const token = authHeader.replace('Bearer ', '');
    return this.jwtService.verifyToken(token);
  }
}
