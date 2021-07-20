import { BaseModel } from './base.interface';
export interface User extends BaseModel {
  name: string;
  email: string;
  password: string;
  groups: string[];
}
