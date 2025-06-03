import {
  Controller,
  Post,
  UseGuards,
  Body,
  Put,
  Delete,
  Param,
  Req,
  UsePipes,
  ValidationPipe,
  Get,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from 'src/common/enum/user/roles.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto } from './expenses.dto';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @Roles(UserRole.USER)
  async addExpense(
    @Body() createExpenseDto: CreateExpenseDto,
    @Req() req: Request,
  ) {
    // Only user or admin can add expense
    // Assume req.user.userId is available from auth middleware
    return this.expensesService.createExpense(
      createExpenseDto,
      (req.user as any).userId,
    );
  }

  // get group expenses
  @Get('group/:id')
  @Roles(UserRole.USER)
  async getGroupExpenses(@Param('id') id: string) {
    return this.expensesService.getGroupExpenses(id);
  }

  @Put(':id')
  @Roles(UserRole.USER)
  async updateExpense(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    // Only user or admin can update expense
    return this.expensesService.updateExpense(id, updateExpenseDto);
  }

  @Delete(':id')
  @Roles(UserRole.USER)
  async deleteExpense(@Param('id') id: string) {
    // Only user or admin can delete expense
    return this.expensesService.deleteExpense(id);
  }
}
