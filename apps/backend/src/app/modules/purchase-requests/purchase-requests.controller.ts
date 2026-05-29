import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from "@nestjs/common";
import { PurchaseRequestsService } from "./purchase-requests.service";
import { CreatePrDto } from "./dto/create-pr.dto";
import { UpdatePrStatusDto } from "./dto/update-pr-status.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller('purchase-requests')
@UseGuards(JwtAuthGuard)
export class PurchaseRequestsController {

  constructor(private prService: PurchaseRequestsService) {}

  // Any logged in user can create a PR
  @Post()
  create(@Body() dto: CreatePrDto, @Request() req: any) {
    return this.prService.create(dto, req.user.userId)
  }

  // Procurement manager sees all PRs
  @Get()
  @UseGuards(RolesGuard)
  @Roles('procurement_manager', 'super_admin')
  findAll() {
    return this.prService.findAll()
  }

  // Requester sees only their own PRs
  @Get('my')
  findMyPRs(@Request() req: any) {
    return this.prService.findMyPRs(req.user.userId)
  }

  // Get single PR
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.prService.findById(id)
  }

  // Procurement manager approves or rejects
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('procurement_manager', 'super_admin')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePrStatusDto,
    @Request() req: any
  ) {
    return this.prService.updateStatus(id, dto, req.user.userId)
  }

}