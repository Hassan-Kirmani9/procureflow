import { Injectable, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Department, DepartmentDocument } from "./schemas/department.schema";
import { CreateDepartmentDto } from "../users/dto/create-department.dto";

@Injectable()
export class DepartmentsService {

  constructor(@InjectModel(Department.name) private departmentModel: Model<DepartmentDocument>) {}

  async findAll() {
    return this.departmentModel.find()
  }

  async create(dto: CreateDepartmentDto) {
    const existing = await this.departmentModel.findOne({ code: dto.code })
    if (existing) throw new ConflictException('Department code already exists')
    return this.departmentModel.create(dto)
  }

  async deactivate(id: string) {
    return this.departmentModel.findByIdAndUpdate(id, { isActive: false }, { new: true })
  }
}