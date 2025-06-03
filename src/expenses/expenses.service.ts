import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense, ExpenseDocument } from './expenses.schema';
import { CreateExpenseDto, UpdateExpenseDto } from './expenses.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
  ) {}

  async createExpense(createExpenseDto: CreateExpenseDto, createdBy: string) {
    const expense = new this.expenseModel({
      ...createExpenseDto,
      createdBy,
      date: new Date(createExpenseDto.date),
    });
    const savedExpense = await expense.save();
    return {
      message: 'Expense created successfully',
      expense: savedExpense,
      status: HttpStatus.CREATED,
    };
  }

  async updateExpense(id: string, updateExpenseDto: UpdateExpenseDto) {
    const expense = await this.expenseModel.findByIdAndUpdate(
      id,
      {
        ...updateExpenseDto,
        ...(updateExpenseDto.date && { date: new Date(updateExpenseDto.date) }),
      },
      { new: true },
    );
    if (!expense) throw new NotFoundException('Expense not found');
    return {
      message: 'Expense updated successfully',
      expense,
      status: HttpStatus.OK,
    };
  }

  async getGroupExpenses(id: string) {
    const expenses = await this.expenseModel
      .find({ group: id })
      .populate('participants');
    return {
      message: 'Expenses fetched successfully',
      expenses,
      status: HttpStatus.OK,
    };
  }

  async deleteExpense(id: string) {
    const expense = await this.expenseModel.findByIdAndDelete(id);
    if (!expense) throw new NotFoundException('Expense not found');
    return {
      message: 'Expense deleted successfully',
      expense,
      status: HttpStatus.OK,
    };
  }
}
