import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Supplier, SupplierDocument, SupplierStatus } from "./schemas/supplier.schema";
import { CreateSupplierDto } from "./dto/create-supplier.dto";

@Injectable()
export class SuppliersService {

  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>
  ) {}

  async create(dto: CreateSupplierDto) {
    const existing = await this.supplierModel.findOne({ user: dto.userId })
    if (existing) throw new ConflictException('Supplier profile already exists for this user')
    return this.supplierModel.create({
      user: dto.userId,
      companyName: dto.companyName,
      contactEmail: dto.contactEmail,
      phone: dto.phone,
      address: dto.address,
      categories: dto.categories || [],
      notes: dto.notes
    })
  }

  async findAll() {
    return this.supplierModel.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
  }

  async findById(id: string) {
    const supplier = await this.supplierModel.findById(id)
      .populate('user', 'name email')
    if (!supplier) throw new NotFoundException('Supplier not found')
    return supplier
  }

  async verify(id: string) {
    const supplier = await this.supplierModel.findById(id)
    if (!supplier) throw new NotFoundException('Supplier not found')
    supplier.status = SupplierStatus.VERIFIED
    return supplier.save()
  }

  async blacklist(id: string, notes: string) {
    const supplier = await this.supplierModel.findById(id)
    if (!supplier) throw new NotFoundException('Supplier not found')
    supplier.status = SupplierStatus.BLACKLISTED
    supplier.notes = notes
    return supplier.save()
  }

  async updateScore(id: string, score: number) {
    const supplier = await this.supplierModel.findById(id)
    if (!supplier) throw new NotFoundException('Supplier not found')
    supplier.performanceScore = score
    return supplier.save()
  }
}