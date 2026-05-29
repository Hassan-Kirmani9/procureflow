import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PurchaseOrder, PurchaseOrderDocument, POStatus } from "./schemas/purchase-order.schema";
import { RFQ, RFQDocument } from "../rfq/schemas/rfq.schema";
import { CreatePoDto } from "./dto/create-po.dto";

@Injectable()
export class PurchaseOrdersService {

  constructor(
    @InjectModel(PurchaseOrder.name) private poModel: Model<PurchaseOrderDocument>,
    @InjectModel(RFQ.name) private rfqModel: Model<RFQDocument>
  ) {}

  async createFromRfq(dto: CreatePoDto, userId: string) {
    const rfq = await this.rfqModel.findById(dto.rfqId)
      .populate('purchaseRequest')
    if (!rfq) throw new NotFoundException('RFQ not found')

    const winningQuote = rfq.quotes.find(q => q.isWinner)
    if (!winningQuote) throw new NotFoundException('No winning quote found')

    const poNumber = `PO-${Date.now()}`

    return this.poModel.create({
      rfq: rfq._id,
      purchaseRequest: rfq.purchaseRequest,
      supplier: winningQuote.supplier,
      title: rfq.title,
      quantity: rfq.quantity,
      unitPrice: winningQuote.unitPrice,
      totalAmount: winningQuote.totalPrice,
      deliveryDays: winningQuote.deliveryDays,
      paymentTerms: winningQuote.paymentTerms,
      createdBy: userId,
      poNumber,
      status: POStatus.PENDING
    })
  }

  async findAll() {
    return this.poModel.find()
      .populate('supplier', 'name email')
      .populate('purchaseRequest', 'title')
      .populate('rfq', 'title')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
  }

  async findById(id: string) {
    const po = await this.poModel.findById(id)
      .populate('supplier', 'name email')
      .populate('purchaseRequest', 'title department')
      .populate('rfq', 'title')
      .populate('createdBy', 'name email')
    if (!po) throw new NotFoundException('Purchase order not found')
    return po
  }

  async findBySupplier(supplierId: string) {
    return this.poModel.find({ supplier: supplierId })
      .populate('purchaseRequest', 'title')
      .populate('rfq', 'title')
      .sort({ createdAt: -1 })
  }

  async approve(id: string) {
    const po = await this.poModel.findById(id)
    if (!po) throw new NotFoundException('PO not found')
    po.status = POStatus.APPROVED
    return po.save()
  }

  async acknowledge(id: string) {
    const po = await this.poModel.findById(id)
    if (!po) throw new NotFoundException('PO not found')
    po.status = POStatus.ACKNOWLEDGED
    return po.save()
  }

  async cancel(id: string) {
    const po = await this.poModel.findById(id)
    if (!po) throw new NotFoundException('PO not found')
    po.status = POStatus.CANCELLED
    return po.save()
  }
}