import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum PRStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum PRPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

@Schema({ timestamps: true })
export class PurchaseRequest {

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  category: string

  @Prop({ required: true })
  department: string

  @Prop({ required: true })
  budgetCode: string

  @Prop({ required: true })
  estimatedCost: number

  @Prop({ required: true })
  quantity: number

  @Prop({ enum: PRPriority, default: PRPriority.MEDIUM })
  priority: PRPriority

  @Prop({ enum: PRStatus, default: PRStatus.DRAFT })
  status: PRStatus

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  requestedBy: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy: Types.ObjectId

  @Prop()
  rejectionReason: string

  @Prop({ type: [{ 
    user: { type: Types.ObjectId, ref: 'User' },
    comment: String,
    action: String,
    timestamp: { type: Date, default: Date.now }
  }], default: [] })
  comments: any[]

  @Prop()
  neededBy: Date

}

export type PurchaseRequestDocument = PurchaseRequest & Document
export const PurchaseRequestSchema = SchemaFactory.createForClass(PurchaseRequest)