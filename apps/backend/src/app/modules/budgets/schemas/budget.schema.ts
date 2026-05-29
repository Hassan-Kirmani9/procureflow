import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Budget {

  @Prop({ required: true })
  department: string

  @Prop({ required: true })
  fiscalYear: number

  @Prop({ required: true })
  totalAmount: number

  @Prop({ default: 0 })
  committedAmount: number

  @Prop({ default: 0 })
  actualSpend: number

  @Prop({ default: true })
  isActive: boolean

}

export type BudgetDocument = Budget & Document
export const BudgetSchema = SchemaFactory.createForClass(Budget)