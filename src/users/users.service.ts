import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { verifyUserDtoReturnDto } from './dto/verify-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async getUserByPhone(phone: string) {
    const user = await this.prisma.user.findFirst({
      where: { phone: phone },
    });
    return user;
  }
  async getUserById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });
    return user;
  }

  async requestOtp(phone: string): Promise<string> {
    const user = await this.getUserByPhone(phone);
    if (user) {
      if (user.otp) {
        const otpCreateAt = moment(user.otpCreateAt, 'x');
        const now = moment();
        const diff = now.diff(otpCreateAt, 'seconds');
        if (diff < 60) {
          throw new BadRequestException(
            'OTP is already sent you can request again after ' +
              (60 - diff) +
              ' seconds',
          );
        }
      }
      const otp = await this.#sendOtp(user);
      return otp;
    }
    return null;
  }

  async verifyOtp(phone: string, otp: string): Promise<verifyUserDtoReturnDto> {
    const user = await this.getUserByPhone(phone);
    if (user) {
      if (user.otp) {
        const otpCreateAt = moment(user.otpCreateAt, 'x');
        const now = moment();
        const diff = now.diff(otpCreateAt, 'seconds');
        if (diff > 60 * 5) {
          throw new BadRequestException('OTP is expired');
        }
      }
      if (user.otp !== otp) throw new Error('OTP is not correct');
      return {
        user,
        otp,
      };
    }
    throw new BadRequestException('User not found');
  }

  async #hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async setPassword(phone: string, password: string) {
    const user = await this.getUserByPhone(phone);
    // encode password using bcrypt
    const hashedPassword = await this.#hashPassword(password);

    if (user) {
      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          otpCreateAt: (Number(user.otpCreateAt) - 5 * 60 * 1000).toString(),
        },
      });
      return !!updatedUser;
    }
    throw new BadRequestException('User not found');
  }

  async setAccountType(phone: string, employee: boolean) {
    const user = await this.getUserByPhone(phone);
    if (user) {
      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: { employee },
      });
      return updatedUser;
    }
    throw new BadRequestException('User not found');
  }

  async #sendOtp(user: User) {
    if (user) {
      const otp = Math.floor(Math.random() * 90000) + 10000;
      const otpCreateAt = new Date().getTime().toString();
      try {
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            otp: otp.toString(),
            otpCreateAt,
          },
        });
        return otp;
      } catch (error) {
        return error;
      }
    }
  }

  async findOne(phone: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: { phone: phone },
    });
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
