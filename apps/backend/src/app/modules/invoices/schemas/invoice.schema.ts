import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum InvoiceStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid'
}

@Schema({ timestamps: true })
export class Invoice {

  @Prop({ type: Types.ObjectId, ref: 'PurchaseOrder', required: true })
  purchaseOrder: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  supplier: Types.ObjectId

  @Prop({ required: true })
  invoiceNumber: string

  @Prop({ required: true })
  amount: number

  @Prop({ required: true })
  dueDate: Date

  @Prop({ enum: InvoiceStatus, default: InvoiceStatus.PENDING })
  status: InvoiceStatus

  @Prop()
  notes: string

  @Prop()
  rejectionReason: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy: Types.ObjectId

  @Prop()
  paidAt: Date

}

export type InvoiceDocument = Invoice & Document
export const InvoiceSchema = SchemaFactory.createForClass(Invoice)