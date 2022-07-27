import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { AuthUser } from 'src/decorators/user.decorator';
import { GlobalService } from 'src/global/global.service';
import { S3Service } from 'src/upload/upload.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { setPasswordDto, verifyUserDto } from './dto/verify-user.dto';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
@ApiTags('User services')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly uploader: S3Service,
    private readonly globalService: GlobalService,
  ) {}

  @Public()
  @Post('/verify')
  async verifyNumber(@Body() { phone }: verifyUserDto) {
    const otp = await this.usersService.requestOtp(phone);
    if (!otp) throw new Error("User doesn't exist");
    return otp;
  }

  @ApiOperation({
    summary: 'Use access_token from the response to do next request',
  })
  @Public()
  @Post('/set-password')
  async setPassword(@Body() { phone, password, otp }: setPasswordDto) {
    const { user } = await this.usersService.verifyOtp(phone, otp);
    if (!user) throw new Error("User doesn't exist");
    const { access_token } = await this.globalService.generateToken(user);
    const setPassword = await this.usersService.setPassword(phone, password);
    return {
      message: setPassword ? 'Password set successfully' : 'Password not set',
      success: setPassword,
      access_token,
    };
  }

  @ApiOperation({
    summary: 'Set account type for current user',
  })
  @Post('/set-account-type')
  async setAccountType(@Body() { account_type }: any, @AuthUser() user: User) {
    const existingUser = await this.usersService.getUserById(user.id);
    if (!existingUser) throw new Error("User doesn't exist");
    return existingUser;
    // return this.usersService.setAccountType(user, account_type);
  }

  @Get('/')
  async findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.uploader.uploadFile(file);
  }

  @Get(':id')
  findOne(@Body() user: any) {
    return this.usersService.findOne(user);
    // return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
