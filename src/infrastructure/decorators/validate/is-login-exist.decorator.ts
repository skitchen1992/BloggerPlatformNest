import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersQueryRepository } from '@features/users/infrastructure/users.query-repository';

//Обязательная регистрация в ioc
@ValidatorConstraint({ name: 'IsLoginExist', async: true })
@Injectable()
export class IsLoginExistConstrain implements ValidatorConstraintInterface {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async validate(value: any): Promise<boolean> {
    return await this.usersQueryRepository.isLoginExist(value);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.value} already exist`;
  }
}

export function IsLoginExist(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'IsLoginExist',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsLoginExistConstrain,
    });
  };
}
