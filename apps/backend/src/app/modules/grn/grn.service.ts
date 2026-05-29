import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GRN, GRNDocument, GRNStatus } from "./schemas/grn.schema";
import { PurchaseOrder, PurchaseOrderDocument, POStatus } from "../purchase-orders/schemas/purchase-order.schema";
import { CreateGrnDto } from "./dto/create-grn.dto";

@Injectable()
export class GrnService {

  constructor(
    @InjectModel(GRN.name) private grnModel: Model<GRNDocument>,
    @InjectModel(PurchaseOrder.name) private poModel: Model<PurchaseOrderDocument>
  ) {}

  async create(dto: CreateGrnDto, userId: string) {
    const po = await this.poModel.findById(dto.purchaseOrderId)
    if (!po) throw new NotFoundException('Purchase order not found')

    let status = GRNStatus.FULL
    if (dto.quantityReceived < dto.quantityOrdered) {
      status = dto.discrepancyNotes ? GRNStatus.DISCREPANCY : GRNStatus.PARTIAL
    }

    const grn = await this.grnModel.create({
      purchaseOrder: dto.purchaseOrderId,
      quantityOrdered: dto.quantityOrdered,
      quantityReceived: dto.quantityReceived,
      discrepancyNotes: dto.discrepancyNotes,
      receivedBy: dto.receivedBy,
      loggedBy: userId,
      status
    })

    if (dto.quantityReceived >= dto.quantityOrdered) {
      po.status = POStatus.COMPLETED
      await po.save()
    }

    return grn
  }

  async findAll() {
    return this.grnModel.find()
      .populate('purchaseOrder', 'poNumber title totalAmount')
      .populate('loggedBy', 'name email')
      .sort({ createdAt: -1 })
  }

  async findById(id: string) {
    const grn = await this.grnModel.findById(id)
      .populate('purchaseOrder', 'poNumber title totalAmount supplier')
      .populate('loggedBy', 'name email')
    if (!grn) throw new NotFoundException('GRN not found')
    return grn
  }

  async findByPO(poId: string) {
    return this.grnModel.find({ purchaseOrder: poId })
      .populate('loggedBy', 'name email')
  }
}