import { Bill } from '@/interfaces/groups.interface';
import { IsArray, IsString, MinLength } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @MinLength(2)
  public name: string;

  @IsArray()
  public userId: string[];
}

export class AddUsersToGroupDto {
  @IsArray()
  public userId: string[];
}

export class GroupDto {
  id: string;
  name: string;
  members: string[];
  expenses: string[];
  bill: Bill[];
}
