import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    SUPPLIER = 'supplier',
    REQUESTOR = 'requestor',
    PROCUREMENT_MANAGER = 'procurement_manager'
}

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name!: string
    @Prop({ required: false })
    email!: string
    @Prop({ required: true })
    password!: string
    @Prop({ required: true, default: UserRole.REQUESTOR })
    role!: UserRole
    @Prop({ required: true, default: true })
    isActive!: boolean

}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User)