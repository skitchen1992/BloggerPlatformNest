import { Injectable } from '@nestjs/common';
import { User, UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserOutputDto,
  UserOutputDtoMapper,
} from '../api/dto/output/user.output.dto';
import { Pagination } from '@base/models/pagination.base.model';
import {
  UsersQuery,
  UserOutputPaginationDto,
  UserOutputPaginationDtoMapper,
} from '@features/users/api/dto/output/user.output.pagination.dto';

// export abstract class BaseQueryRepository<M> {
//     protected constructor(private model: Model<M>) {
//     }
//
//     async find(filter: FilterQuery<M>,
//                projection?: ProjectionType<M> | null | undefined,
//                options?: QueryOptions<M> | null | undefined,
//                pagination: {skip: number, limit: number }) {
//         return this.model.find<M>(filter, projection, options)
//     }
// }

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name) private userModel: UserModelType,
    private readonly pagination: Pagination,
  ) {}

  public async getById(userId: string): Promise<UserOutputDto | null> {
    const user = await this.userModel.findById(userId).lean();

    if (!user) {
      return null;
    }

    return UserOutputDtoMapper(user);
  }

  public async getAll(query: UsersQuery): Promise<UserOutputPaginationDto> {
    const pagination = this.pagination.getUsers(query);

    const users = await this.userModel
      .find(pagination.query)
      .sort(pagination.sort)
      .skip(pagination.skip)
      .limit(pagination.pageSize)
      .lean();

    const totalCount = await this.userModel.countDocuments(pagination.query);

    const userList = users.map((user) => UserOutputDtoMapper(user));

    return UserOutputPaginationDtoMapper(
      userList,
      totalCount,
      pagination.pageSize,
      pagination.page,
    );
  }

  public async isLoginExist(login: string): Promise<boolean> {
    const user = await this.userModel.findOne({ login: login });
    return !user;
  }

  public async isEmailExist(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email: email });

    return !user;
  }
}
