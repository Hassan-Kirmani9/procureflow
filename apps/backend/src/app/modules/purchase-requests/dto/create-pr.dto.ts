import { PRPriority } from "../schemas/purchase-request.schema";

export class CreatePrDto {
  title: string
  description: string
  category: string
  department: string
  budgetCode: string
  estimatedCost: number
  quantity: number
  priority?: PRPriority
  neededBy?: Date
}