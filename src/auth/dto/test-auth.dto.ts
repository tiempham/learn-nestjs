import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ default: '0937808864', required: true })
  readonly phone: string;
  @ApiProperty({ default: 'any', required: true })
  readonly password: string;
}
