import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Budget, BudgetDocument } from "./schemas/budget.schema";
import { CreateBudgetDto } from "./dto/create-budget.dto";

@Injectable()
export class BudgetsService {

  constructor(
    @InjectModel(Budget.name) private budgetModel: Model<BudgetDocument>
  ) {}

  async create(dto: CreateBudgetDto) {
    const existing = await this.budgetModel.findOne({
      department: dto.department,
      fiscalYear: dto.fiscalYear
    })
    if (existing) throw new ConflictException('Budget already exists for this department and fiscal year')
    return this.budgetModel.create(dto)
  }

  async findAll() {
    return this.budgetModel.find().sort({ department: 1 })
  }

  async findById(id: string) {
    const budget = await this.budgetModel.findById(id)
    if (!budget) throw new NotFoundException('Budget not found')
    return budget
  }

  async commitAmount(department: string, amount: number) {
    const budget = await this.budgetModel.findOne({
      department,
      isActive: true
    })
    if (!budget) return null
    budget.committedAmount += amount
    return budget.save()
  }

  async addActualSpend(department: string, amount: number) {
    const budget = await this.budgetModel.findOne({
      department,
      isActive: true
    })
    if (!budget) return null
    budget.actualSpend += amount
    return budget.save()
  }

  async getUtilization(id: string) {
    const budget = await this.budgetModel.findById(id)
    if (!budget) throw new NotFoundException('Budget not found')

    const utilization = (budget.committedAmount / budget.totalAmount) * 100
    const actualUtilization = (budget.actualSpend / budget.totalAmount) * 100

    return {
      ...budget.toObject(),
      utilizationPercent: Math.round(utilization),
      actualUtilizationPercent: Math.round(actualUtilization),
      remaining: budget.totalAmount - budget.committedAmount,
      alert80: utilization >= 80,
      alert100: utilization >= 100
    }
  }

  async getAllWithUtilization() {
    const budgets = await this.budgetModel.find().sort({ department: 1 })
    return budgets.map(budget => {
      const utilization = budget.totalAmount > 0
        ? (budget.committedAmount / budget.totalAmount) * 100
        : 0
      return {
        ...budget.toObject(),
        utilizationPercent: Math.round(utilization),
        remaining: budget.totalAmount - budget.committedAmount,
        alert80: utilization >= 80,
        alert100: utilization >= 100
      }
    })
  }

  async update(id: string, totalAmount: number) {
    return this.budgetModel.findByIdAndUpdate(
      id,
      { totalAmount },
      { new: true }
    )
  }
}