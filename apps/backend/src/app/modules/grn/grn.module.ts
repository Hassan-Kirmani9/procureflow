import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { GRN, GRNSchema } from "./schemas/grn.schema";
import { PurchaseOrder, PurchaseOrderSchema } from "../purchase-orders/schemas/purchase-order.schema";
import { GrnController } from "./grn.controller";
import { GrnService } from "./grn.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GRN.name, schema: GRNSchema },
      { name: PurchaseOrder.name, schema: PurchaseOrderSchema }
    ])
  ],
  controllers: [GrnController],
  providers: [GrnService],
  exports: [GrnService]
})
export class GrnModule {}