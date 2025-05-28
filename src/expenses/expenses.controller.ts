import { Controller, Post, UseGuards, Body, Put, Delete } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from 'src/common/enum/user/roles.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExpensesController {
  @Post()
  @Roles(UserRole.USER)
  addExpense(@Body() body: any) {
    // Only user or admin can add expense
  }

  @Put(':id')
  @Roles(UserRole.USER)
  updateExpense(@Body() body: any) {
    // Only user or admin can update expense
  }

  @Delete(':id')
  @Roles(UserRole.USER)
  deleteExpense(@Body() body: any) {
    // Only user or admin can delete expense
  }
}
