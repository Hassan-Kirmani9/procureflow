import { Controller, Get, Post, Body, Param, Patch, UseGuards } from "@nestjs/common";
import { BudgetsService } from "./budgets.service";
import { CreateBudgetDto } from "./dto/create-budget.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller('budgets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BudgetsController {

  constructor(private budgetsService: BudgetsService) {}

  @Post()
  @Roles('super_admin')
  create(@Body() dto: CreateBudgetDto) {
    return this.budgetsService.create(dto)
  }

  @Get()
  @Roles('super_admin', 'procurement_manager')
  findAll() {
    return this.budgetsService.findAll()
  }

  @Get('utilization')
  @Roles('super_admin', 'procurement_manager')
  getAllWithUtilization() {
    return this.budgetsService.getAllWithUtilization()
  }

  @Get(':id')
  @Roles('super_admin', 'procurement_manager')
  findById(@Param('id') id: string) {
    return this.budgetsService.findById(id)
  }

  @Get(':id/utilization')
  @Roles('super_admin', 'procurement_manager')
  getUtilization(@Param('id') id: string) {
    return this.budgetsService.getUtilization(id)
  }

  @Patch(':id')
  @Roles('super_admin')
  update(@Param('id') id: string, @Body() body: { totalAmount: number }) {
    return this.budgetsService.update(id, body.totalAmount)
  }
}