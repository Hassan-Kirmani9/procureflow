import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PurchaseRequest, PurchaseRequestDocument, PRStatus } from "./schemas/purchase-request.schema";
import { CreatePrDto } from "./dto/create-pr.dto";
import { UpdatePrStatusDto } from "./dto/update-pr-status.dto";

@Injectable()
export class PurchaseRequestsService {

  constructor(
    @InjectModel(PurchaseRequest.name)
    private prModel: Model<PurchaseRequestDocument>
  ) {}

  async create(dto: CreatePrDto, userId: string) {
    return this.prModel.create({
      ...dto,
      requestedBy: userId,
      status: PRStatus.SUBMITTED
    })
  }

  async findAll() {
    return this.prModel.find()
      .populate('requestedBy', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
  }

  async findMyPRs(userId: string) {
    return this.prModel.find({ requestedBy: userId })
      .sort({ createdAt: -1 })
  }

  async findById(id: string) {
    const pr = await this.prModel.findById(id)
      .populate('requestedBy', 'name email')
      .populate('reviewedBy', 'name email')
    if (!pr) throw new NotFoundException('Purchase request not found')
    return pr
  }

  async updateStatus(id: string, dto: UpdatePrStatusDto, userId: string) {
    const pr = await this.prModel.findById(id)
    if (!pr) throw new NotFoundException('Purchase request not found')

    pr.status = dto.status as PRStatus
    pr.reviewedBy = userId as any

    if (dto.rejectionReason) pr.rejectionReason = dto.rejectionReason

    if (dto.comment) {
      pr.comments.push({
        user: userId,
        comment: dto.comment,
        action: dto.status,
        timestamp: new Date()
      })
    }

    return pr.save()
  }

}