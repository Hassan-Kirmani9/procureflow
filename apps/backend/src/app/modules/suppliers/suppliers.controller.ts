import { Controller, Get, Post, Body, Param, Patch, UseGuards } from "@nestjs/common";
import { SuppliersService } from "./suppliers.service";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('procurement_manager', 'super_admin')
export class SuppliersController {

  constructor(private suppliersService: SuppliersService) {}

  @Post()
  create(@Body() dto: CreateSupplierDto) {
    return this.suppliersService.create(dto)
  }

  @Get()
  findAll() {
    return this.suppliersService.findAll()
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.suppliersService.findById(id)
  }

  @Patch(':id/verify')
  verify(@Param('id') id: string) {
    return this.suppliersService.verify(id)
  }

  @Patch(':id/blacklist')
  blacklist(@Param('id') id: string, @Body() body: { notes: string }) {
    return this.suppliersService.blacklist(id, body.notes)
  }

  @Patch(':id/score')
  updateScore(@Param('id') id: string, @Body() body: { score: number }) {
    return this.suppliersService.updateScore(id, body.score)
  }
}