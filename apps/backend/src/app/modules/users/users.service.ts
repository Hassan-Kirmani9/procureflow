import { Injectable, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { User, UserDocument } from "../auth/schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll() {
    return this.userModel.find().select('-password')
  }

  async findById(id: string) {
    return this.userModel.findById(id).select('-password')
  }

  async create(createUserDto: CreateUserDto) {
    const existing = await this.userModel.findOne({ email: createUserDto.email })
    if (existing) throw new ConflictException('Email already exists')

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword
    })

    const { password, ...result } = user.toObject()
    return result
  }

  async deactivate(id: string) {
    return this.userModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).select('-password')
  }

}