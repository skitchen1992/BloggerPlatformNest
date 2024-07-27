import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from '../infrastructure/users.query-repository';
import { CreateUserDto } from './dto/input/create-user.input.dto';
import { UsersService } from '../application/users.service';
import { UsersQuery } from '@features/users/api/dto/output/user.output.pagination.dto';
import { BasicAuthGuard } from '@infrastructure/guards/basic-auth-guard.service';

// Tag для swagger
@ApiTags('Users')
@Controller('users')
@ApiSecurity('basic')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  async getAll(@Query() query: UsersQuery) {
    return await this.usersQueryRepository.getAll(query);
  }

  @Post()
  async create(@Body() input: CreateUserDto) {
    const { login, password, email } = input;

    const createdUserId: string = await this.usersService.create(
      login,
      password,
      email,
    );

    return await this.usersQueryRepository.getById(createdUserId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const isDeleted: boolean = await this.usersService.delete(id);

    if (!isDeleted) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
