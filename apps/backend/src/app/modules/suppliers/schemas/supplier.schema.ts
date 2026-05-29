import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum SupplierStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  BLACKLISTED = 'blacklisted'
}

@Schema({ timestamps: true })
export class Supplier {

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId

  @Prop({ required: true })
  companyName: string

  @Prop({ required: true })
  contactEmail: string

  @Prop()
  phone: string

  @Prop()
  address: string

  @Prop({ type: [String], default: [] })
  categories: string[]

  @Prop({ enum: SupplierStatus, default: SupplierStatus.PENDING })
  status: SupplierStatus

  @Prop({ default: 0, min: 0, max: 5 })
  performanceScore: number

  @Prop()
  notes: string

}

export type SupplierDocument = Supplier & Document
export const SupplierSchema = SchemaFactory.createForClass(Supplier)