import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from '../infrastructure/users.query-repository';
import { CreateUserDto } from './dto/input/create-user.input.dto';
import { UsersQuery } from '@features/users/api/dto/output/user.output.pagination.dto';
import { BasicAuthGuard } from '@infrastructure/guards/basic-auth-guard.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '@features/users/application/handlers/create-user.handler';
import { DeleteUserCommand } from '@features/users/application/handlers/delete-user.handler';
import { GetCommentQuery } from '@features/posts/application/handlers/get-comment.handler';
import { CommentOutputDto } from '@features/comments/api/dto/output/comment.output.dto';
import { GetAllUsersQuery } from '@features/users/application/handlers/get-all-users.handler';

// Tag для swagger
@ApiTags('Users')
@Controller('users')
@ApiSecurity('basic')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAll(@Query() query: UsersQuery) {
    return await this.queryBus.execute<GetAllUsersQuery, CommentOutputDto>(
      new GetAllUsersQuery(query),
    );
  }

  @Post()
  async create(@Body() input: CreateUserDto) {
    const { login, password, email } = input;

    const createdUserId: string = await this.commandBus.execute<
      CreateUserCommand,
      string
    >(new CreateUserCommand(login, password, email));

    return await this.usersQueryRepository.getById(createdUserId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.commandBus.execute<DeleteUserCommand, void>(
      new DeleteUserCommand(id),
    );
  }
}
