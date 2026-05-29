import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RFQ, RFQDocument, RFQStatus } from "./schemas/rfq.schema";
import { CreateRfqDto } from "./dto/create-rfq.dto";
import { SubmitQuoteDto } from "./dto/submit-quote.dto";

@Injectable()
export class RfqService {

  constructor(@InjectModel(RFQ.name) private rfqModel: Model<RFQDocument>) {}

  async create(dto: CreateRfqDto, userId: string) {
    return this.rfqModel.create({
      purchaseRequest: dto.purchaseRequestId,
      title: dto.title,
      description: dto.description,
      quantity: dto.quantity,
      deadline: dto.deadline,
      invitedSuppliers: dto.invitedSuppliers,
      createdBy: userId
    })
  }

  async findAll() {
    return this.rfqModel.find()
      .populate('purchaseRequest', 'title')
      .populate('invitedSuppliers', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
  }

  async findById(id: string) {
    const rfq = await this.rfqModel.findById(id)
      .populate('purchaseRequest', 'title estimatedCost')
      .populate('invitedSuppliers', 'name email')
      .populate('quotes.supplier', 'name email')
      .populate('createdBy', 'name email')
    if (!rfq) throw new NotFoundException('RFQ not found')
    return rfq
  }

  async findMyInvitations(supplierId: string) {
    return this.rfqModel.find({ invitedSuppliers: supplierId })
      .populate('purchaseRequest', 'title')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
  }

  async submitQuote(rfqId: string, dto: SubmitQuoteDto, supplierId: string) {
    const rfq = await this.rfqModel.findById(rfqId)
    if (!rfq) throw new NotFoundException('RFQ not found')

    const alreadyQuoted = rfq.quotes.find(
      q => q.supplier.toString() === supplierId
    )
    if (alreadyQuoted) throw new ForbiddenException('You have already submitted a quote')

    rfq.quotes.push({
      supplier: supplierId as any,
      ...dto,
      isWinner: false,
      submittedAt: new Date()
    })

    return rfq.save()
  }

  async selectWinner(rfqId: string, supplierId: string) {
    const rfq = await this.rfqModel.findById(rfqId)
    if (!rfq) throw new NotFoundException('RFQ not found')

    rfq.quotes.forEach(q => {
      q.isWinner = q.supplier.toString() === supplierId
    })

    rfq.status = RFQStatus.AWARDED
    return rfq.save()
  }

  async closeRfq(rfqId: string) {
    return this.rfqModel.findByIdAndUpdate(
      rfqId,
      { status: RFQStatus.CLOSED },
      { new: true }
    )
  }
}