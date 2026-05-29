import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum GRNStatus {
  FULL = 'full',
  PARTIAL = 'partial',
  DISCREPANCY = 'discrepancy'
}

@Schema({ timestamps: true })
export class GRN {

  @Prop({ type: Types.ObjectId, ref: 'PurchaseOrder', required: true })
  purchaseOrder: Types.ObjectId

  @Prop({ required: true })
  quantityOrdered: number

  @Prop({ required: true })
  quantityReceived: number

  @Prop({ enum: GRNStatus, default: GRNStatus.FULL })
  status: GRNStatus

  @Prop()
  discrepancyNotes: string

  @Prop()
  receivedBy: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  loggedBy: Types.ObjectId

  @Prop({ default: Date.now })
  receivedAt: Date

}

export type GRNDocument = GRN & Document
export const GRNSchema = SchemaFactory.createForClass(GRN)