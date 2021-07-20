import { BaseModel } from './base.interface';

export interface Bill {
  userId: string;
  lendingAmount: number;
  repaymentAmount: number;
}
export interface Group extends BaseModel {
  name: string;
  members: string[];
  expenses: string[];
  bill: Bill[];
}
