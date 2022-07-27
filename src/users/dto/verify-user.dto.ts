import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from '@prisma/client';
export class verifyUserDto {
  @IsNotEmpty()
  @ApiProperty({ default: '0937808864', required: true })
  readonly phone: string;
}

export interface verifyUserDtoReturnDto {
  otp: string;
  user: User;
}

export class setPasswordDto {
  @IsNotEmpty()
  @ApiProperty({ default: '', required: true })
  readonly password: string;

  @IsNotEmpty()
  @ApiProperty({ default: '', required: true })
  readonly otp: string;

  @IsNotEmpty()
  @ApiProperty({ default: '0937808864', required: true })
  readonly phone: string;
}
