// baseModel for all model interface
export interface BaseModel {
  _id: string;
  entityType?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
