import { model, Schema, Document } from 'mongoose';
import { Expense } from '@interfaces/expenses.interface';

const expenseSchema: Schema = new Schema(
  {
    amount: {
      type: Number,
      require: true,
    },
    description: String,
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      require: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    entityType: {
      type: String,
      default: 'Expense',
    },
  },
  { timestamps: true },
);

// userSchema.plugin(paginate);

const expenseModel = model<Expense & Document>('Expense', expenseSchema);

export default expenseModel;
