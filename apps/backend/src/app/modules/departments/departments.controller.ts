import { Controller, Get, Post, Body, Patch, Param, UseGuards } from "@nestjs/common";
import { DepartmentsService } from "./departments.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CreateDepartmentDto } from "../users/dto/create-department.dto";

@Controller('departments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin')
export class DepartmentsController {

  constructor(private departmentsService: DepartmentsService) {}

  @Get()
  findAll() {
    return this.departmentsService.findAll()
  }

  @Post()
  create(@Body() dto: CreateDepartmentDto) {
    return this.departmentsService.create(dto)
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.departmentsService.deactivate(id)
  }
}