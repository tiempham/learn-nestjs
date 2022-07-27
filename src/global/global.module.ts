import { Global, Module } from '@nestjs/common';
import { GlobalService } from './global.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [GlobalService],
  exports: [GlobalService],
})
export class GlobalModule {}
