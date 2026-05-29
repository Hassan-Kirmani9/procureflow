import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Department {
  @Prop({ required: true })
  name!: string

  @Prop({ required: true, unique: true })
  code!: string

  @Prop({ default: 0 })
  budget!: number

  @Prop({ default: true })
  isActive!: boolean
}

export type DepartmentDocument = Department & Document
export const DepartmentSchema = SchemaFactory.createForClass(Department)