import { model, Schema, Document } from 'mongoose';
import { Group } from '@interfaces/groups.interface';

const groupSchema: Schema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: String,
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    expenses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Expense',
      },
    ],
    bill: [
      {
        userId: Schema.Types.ObjectId,
        repaymentAmount: Number,
        lendingAmount: Number,
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    entityType: {
      type: String,
      default: 'Group',
    },
  },
  { timestamps: true },
);

// userSchema.plugin(paginate);

const groupModel = model<Group & Document>('Group', groupSchema);

export default groupModel;
