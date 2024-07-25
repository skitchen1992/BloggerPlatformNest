import { ApiTags } from '@nestjs/swagger';
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
} from '@nestjs/common';
import { UsersQueryRepository } from '../infrastructure/users.query-repository';
import { CreateUserDto } from './dto/input/create-user.input.dto';
import { UsersService } from '../application/users.service';
import { UsersQuery } from '@features/users/api/dto/output/user.output.pagination.dto';

// Tag для swagger
@ApiTags('Users')
@Controller('users')
// Установка guard на весь контроллер
//@UseGuards(AuthGuard)
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
