import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(2)
  public name: string;

  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(3)
  public password: string;
}

export class UserDto {
  id: string;
  name: string;
  email: string;
  groups: string[];
}
