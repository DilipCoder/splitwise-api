import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';
// import { paginate } from './plugins';

// interface IUser extends User {
//   paginate: (filter: Object, options: { skip: number; limit: number }) => Promise<any>;
// }

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      require: true,
    },
    groups: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Group',
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    entityType: {
      type: String,
      default: 'User',
    },
  },
  { timestamps: true },
);

// userSchema.plugin(paginate);

const userModel = model<User & Document>('User', userSchema);

export default userModel;
