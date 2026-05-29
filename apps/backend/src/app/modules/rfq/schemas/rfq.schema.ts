import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum RFQStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  CLOSED = 'closed',
  AWARDED = 'awarded'
}

@Schema({ timestamps: true })
export class Quote {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  supplier: Types.ObjectId

  @Prop({ required: true })
  unitPrice: number

  @Prop({ required: true })
  totalPrice: number

  @Prop({ required: true })
  deliveryDays: number

  @Prop()
  paymentTerms?: string

  @Prop()
  notes?: string

  @Prop({ default: false })
  isWinner: boolean

  @Prop({ default: Date.now })
  submittedAt: Date
}

export const QuoteSchema = SchemaFactory.createForClass(Quote)

@Schema({ timestamps: true })
export class RFQ {
  @Prop({ type: Types.ObjectId, ref: 'PurchaseRequest', required: true })
  purchaseRequest: Types.ObjectId

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  quantity: number

  @Prop({ required: true })
  deadline: Date

  @Prop({ enum: RFQStatus, default: RFQStatus.OPEN })
  status: RFQStatus

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  invitedSuppliers: Types.ObjectId[]

  @Prop({ type: [QuoteSchema], default: [] })
  quotes: Quote[]

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId
}

export type RFQDocument = RFQ & Document
export const RFQSchema = SchemaFactory.createForClass(RFQ) 