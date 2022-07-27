import { IsNotEmpty } from 'class-validator';

export class verifyUserDto {
  @IsNotEmpty()
  readonly phone: string;
}
