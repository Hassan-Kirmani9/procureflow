import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Invoice, InvoiceDocument, InvoiceStatus } from "./schemas/invoice.schema";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";

@Injectable()
export class InvoicesService {

  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>
  ) {}

  async create(dto: CreateInvoiceDto, supplierId: string) {
    const invoiceNumber = `INV-${Date.now()}`
    return this.invoiceModel.create({
      purchaseOrder: dto.purchaseOrderId,
      supplier: supplierId,
      invoiceNumber,
      amount: dto.amount,
      dueDate: dto.dueDate,
      notes: dto.notes,
      status: InvoiceStatus.PENDING
    })
  }

  async findAll() {
    return this.invoiceModel.find()
      .populate('purchaseOrder', 'poNumber title totalAmount')
      .populate('supplier', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
  }

  async findById(id: string) {
    const invoice = await this.invoiceModel.findById(id)
      .populate('purchaseOrder', 'poNumber title totalAmount quantity')
      .populate('supplier', 'name email')
      .populate('approvedBy', 'name email')
    if (!invoice) throw new NotFoundException('Invoice not found')
    return invoice
  }

  async findBySupplier(supplierId: string) {
    return this.invoiceModel.find({ supplier: supplierId })
      .populate('purchaseOrder', 'poNumber title')
      .sort({ createdAt: -1 })
  }

  async approve(id: string, userId: string) {
    const invoice = await this.invoiceModel.findById(id)
    if (!invoice) throw new NotFoundException('Invoice not found')
    invoice.status = InvoiceStatus.APPROVED
    invoice.approvedBy = userId as any
    return invoice.save()
  }

  async reject(id: string, reason: string) {
    const invoice = await this.invoiceModel.findById(id)
    if (!invoice) throw new NotFoundException('Invoice not found')
    invoice.status = InvoiceStatus.REJECTED
    invoice.rejectionReason = reason
    return invoice.save()
  }

  async markAsPaid(id: string) {
    const invoice = await this.invoiceModel.findById(id)
    if (!invoice) throw new NotFoundException('Invoice not found')
    invoice.status = InvoiceStatus.PAID
    invoice.paidAt = new Date()
    return invoice.save()
  }
}