import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { accessTokenDto } from './global.dto';
import { User } from '@prisma/client';

@Injectable()
export class GlobalService {
  constructor(private jwtService: JwtService) {}
  generateToken(user: User): accessTokenDto {
    const payload = {
      id: user.id,
      phone: user.phone,
      employee: user.employee,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
