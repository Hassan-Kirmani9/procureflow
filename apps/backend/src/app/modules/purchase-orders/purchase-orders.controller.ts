import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request, Logger } from "@nestjs/common";
import { PurchaseOrdersService } from "./purchase-orders.service";
import { CreatePoDto } from "./dto/create-po.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller('purchase-orders')
@UseGuards(JwtAuthGuard)
export class PurchaseOrdersController {

  private readonly logger = new Logger(PurchaseOrdersController.name)

  constructor(private poService: PurchaseOrdersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('procurement_manager', 'super_admin')
  create(@Body() dto: CreatePoDto, @Request() req: any) {
    return this.poService.createFromRfq(dto, req.user.userId)
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('procurement_manager', 'super_admin')
  findAll() {
    return this.poService.findAll()
  }

  @Get('my-orders')
  @UseGuards(RolesGuard)
  @Roles('supplier')
  findMyOrders(@Request() req: any) {
    return this.poService.findBySupplier(req.user.userId)
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.poService.findById(id)
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles('procurement_manager', 'super_admin')
  approve(@Param('id') id: string) {
    this.logger.log(`Approve endpoint hit for PO: ${id}`)
    return this.poService.approve(id)
  }

  @Patch(':id/acknowledge')
  @UseGuards(RolesGuard)
  @Roles('supplier')
  acknowledge(@Param('id') id: string) {
    return this.poService.acknowledge(id)
  }

  @Patch(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles('procurement_manager', 'super_admin')
  cancel(@Param('id') id: string) {
    return this.poService.cancel(id)
  }
}