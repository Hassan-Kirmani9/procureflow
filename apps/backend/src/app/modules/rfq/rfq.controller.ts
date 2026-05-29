import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from "@nestjs/common";
import { RfqService } from "./rfq.service";
import { CreateRfqDto } from "./dto/create-rfq.dto";
import { SubmitQuoteDto } from "./dto/submit-quote.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller('rfq')
@UseGuards(JwtAuthGuard)
export class RfqController {

  constructor(private rfqService: RfqService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('procurement_manager', 'super_admin')
  create(@Body() dto: CreateRfqDto, @Request() req: any) {
    return this.rfqService.create(dto, req.user.userId)
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('procurement_manager', 'super_admin')
  findAll() {
    return this.rfqService.findAll()
  }

  @Get('my-invitations')
  @UseGuards(RolesGuard)
  @Roles('supplier')
  findMyInvitations(@Request() req: any) {
    return this.rfqService.findMyInvitations(req.user.userId)
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.rfqService.findById(id)
  }

  @Post(':id/quote')
  @UseGuards(RolesGuard)
  @Roles('supplier')
  submitQuote(
    @Param('id') id: string,
    @Body() dto: SubmitQuoteDto,
    @Request() req: any
  ) {
    return this.rfqService.submitQuote(id, dto, req.user.userId)
  }

  @Patch(':id/winner/:supplierId')
  @UseGuards(RolesGuard)
  @Roles('procurement_manager', 'super_admin')
  selectWinner(
    @Param('id') id: string,
    @Param('supplierId') supplierId: string
  ) {
    return this.rfqService.selectWinner(id, supplierId)
  }

  @Patch(':id/close')
  @UseGuards(RolesGuard)
  @Roles('procurement_manager', 'super_admin')
  closeRfq(@Param('id') id: string) {
    return this.rfqService.closeRfq(id)
  }
}