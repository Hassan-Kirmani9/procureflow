import { Controller, Get, Post, Body, Param, UseGuards, Request } from "@nestjs/common";
import { GrnService } from "./grn.service";
import { CreateGrnDto } from "./dto/create-grn.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller('grn')
@UseGuards(JwtAuthGuard)
export class GrnController {

  constructor(private grnService: GrnService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('procurement_manager', 'super_admin', 'requester')
  create(@Body() dto: CreateGrnDto, @Request() req: any) {
    return this.grnService.create(dto, req.user.userId)
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('procurement_manager', 'super_admin')
  findAll() {
    return this.grnService.findAll()
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.grnService.findById(id)
  }

  @Get('po/:poId')
  findByPO(@Param('poId') poId: string) {
    return this.grnService.findByPO(poId)
  }
}