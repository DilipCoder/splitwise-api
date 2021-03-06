import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsNumber()
  @IsPositive()
  public amount: number;

  @IsString()
  public description: string;

  @IsNotEmpty()
  @IsString()
  public groupId: string;

  @IsNotEmpty()
  @IsString()
  public userId: string;
}
