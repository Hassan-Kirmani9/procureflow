import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum POStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  SENT = 'sent',
  ACKNOWLEDGED = 'acknowledged',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Schema({ timestamps: true })
export class PurchaseOrder {

  @Prop({ type: Types.ObjectId, ref: 'RFQ', required: true })
  rfq: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'PurchaseRequest', required: true })
  purchaseRequest: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  supplier: Types.ObjectId

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  quantity: number

  @Prop({ required: true })
  unitPrice: number

  @Prop({ required: true })
  totalAmount: number

  @Prop({ required: true })
  deliveryDays: number

  @Prop()
  paymentTerms: string

  @Prop({ enum: POStatus, default: POStatus.PENDING })
  status: POStatus

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId

  @Prop()
  notes: string

  @Prop()
  poNumber: string

}

export type PurchaseOrderDocument = PurchaseOrder & Document
export const PurchaseOrderSchema = SchemaFactory.createForClass(PurchaseOrder)