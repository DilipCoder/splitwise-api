import { Router } from 'express';
import ExpensesController from '@controllers/expenses.controller';
import { CreateExpenseDto } from '@dtos/expenses.dto';
import Route from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class ExpensesRoute implements Route {
  public path = '/expenses';
  public router = Router();
  public expensesController = new ExpensesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.expensesController.getExpenses);
    this.router.get(`${this.path}/:id`, this.expensesController.getExpenseById);
    this.router.post(`${this.path}`, validationMiddleware(CreateExpenseDto, 'body'), this.expensesController.createExpense);
    this.router.put(`${this.path}/:id`, validationMiddleware(CreateExpenseDto, 'body', true), this.expensesController.updateExpense);
    this.router.delete(`${this.path}/:id`, this.expensesController.deleteExpense);
  }
}

export default ExpensesRoute;
