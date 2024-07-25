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
@ValidatorConstraint({ name: 'IsEmailExist', async: true })
@Injectable()
export class IsEmailExistConstrain implements ValidatorConstraintInterface {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async validate(value: any): Promise<boolean> {
    return await this.usersQueryRepository.isEmailExist(value);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.value} already exist`;
  }
}

export function IsEmailExist(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'IsEmailExist',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsEmailExistConstrain,
    });
  };
}
