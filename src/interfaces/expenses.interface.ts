import { BaseModel } from './base.interface';

export interface Expense extends BaseModel {
  amount: number;
  description: string;
  groupId: string;
  userId: string;
  date: string;
}
