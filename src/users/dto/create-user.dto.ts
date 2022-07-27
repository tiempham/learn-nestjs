import { ApiProperty } from '@nestjs/swagger';
import { Role as RoleEnum } from 'src/enums/role.enum';
export class CreateUserDto {
  readonly firstName: string;

  readonly lastName: string;

  readonly email: string;

  readonly password: string;

  /**
   * A list of user's roles
   * @example ['admin']
   */
  roles: RoleEnum = RoleEnum.User;
}
