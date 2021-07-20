import { CreateExpenseDto } from '@dtos/expenses.dto';
import HttpException from '@exceptions/HttpException';
import { Expense } from '@interfaces/expenses.interface';
import ExpenseModel from '@models/expenses.model';
import { isEmpty } from '@utils/util';
import groupService from './groups.service';

class ExpenseService {
  public expenses = ExpenseModel;
  public groupService = new groupService();

  public async findAllExpense(): Promise<Expense[]> {
    const expenses: Expense[] = await this.expenses.find();
    return expenses;
  }

  public async findExpenseById(expenseId: string): Promise<Expense> {
    if (isEmpty(expenseId)) throw new HttpException(400, "You're not expenseId");

    const findExpense: Expense = await this.expenses.findOne({ _id: expenseId });
    if (!findExpense) throw new HttpException(409, "You're not expense");

    return findExpense;
  }

  public async createExpense(expenseData: CreateExpenseDto): Promise<Expense> {
    if (isEmpty(expenseData)) throw new HttpException(400, "You're not expenseData");
    const createExpenseData: Expense = await this.expenses.create(expenseData);
    await Promise.all([
      this.groupService._addExpensesToGroup(expenseData.groupId, [createExpenseData._id]),
      this.groupService._updateBillInGroup(expenseData.groupId, { userId: expenseData.userId, amount: expenseData.amount }),
    ]);
    return createExpenseData;
  }

  public async updateExpense(expenseId: string, expenseData: CreateExpenseDto): Promise<Expense> {
    if (isEmpty(expenseData)) throw new HttpException(400, "You're not expenseData");

    const updateExpenseById: Expense = await this.expenses.findByIdAndUpdate(expenseId, { expenseData });
    if (!updateExpenseById) throw new HttpException(409, "You're not expense");
    await Promise.all([
      this.groupService._addExpensesToGroup(updateExpenseById.groupId, [updateExpenseById._id]),
      this.groupService._updateBillInGroup(updateExpenseById.groupId, { userId: updateExpenseById.userId, amount: updateExpenseById.amount }),
    ]);

    return updateExpenseById;
  }

  public async deleteExpense(expenseId: string): Promise<Expense> {
    const deleteExpenseById: Expense = await this.expenses.findByIdAndDelete(expenseId);
    if (!deleteExpenseById) throw new HttpException(409, "You're not expense");

    await Promise.all([
      this.groupService._removeExpensesFromGroup(deleteExpenseById.groupId, [deleteExpenseById._id]),
      this.groupService._updateBillInGroup(deleteExpenseById.groupId, { userId: deleteExpenseById.userId, amount: -deleteExpenseById.amount }),
    ]);

    return deleteExpenseById;
  }
}

export default ExpenseService;
