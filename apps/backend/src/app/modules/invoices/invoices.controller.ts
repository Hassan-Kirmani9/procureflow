import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from "@nestjs/common";
import { InvoicesService } from "./invoices.service";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {

  constructor(private invoicesService: InvoicesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('supplier')
  create(@Body() dto: CreateInvoiceDto, @Request() req: any) {
    return this.invoicesService.create(dto, req.user.userId)
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('procurement_manager', 'super_admin')
  findAll() {
    return this.invoicesService.findAll()
  }

  @Get('my-invoices')
  @UseGuards(RolesGuard)
  @Roles('supplier')
  findMyInvoices(@Request() req: any) {
    return this.invoicesService.findBySupplier(req.user.userId)
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.invoicesService.findById(id)
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles('procurement_manager', 'super_admin')
  approve(@Param('id') id: string, @Request() req: any) {
    return this.invoicesService.approve(id, req.user.userId)
  }

  @Patch(':id/reject')
  @UseGuards(RolesGuard)
  @Roles('procurement_manager', 'super_admin')
  reject(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.invoicesService.reject(id, body.reason)
  }

  @Patch(':id/pay')
  @UseGuards(RolesGuard)
  @Roles('procurement_manager', 'super_admin')
  markAsPaid(@Param('id') id: string) {
    return this.invoicesService.markAsPaid(id)
  }
}