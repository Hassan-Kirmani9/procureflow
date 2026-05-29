import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PurchaseOrder, PurchaseOrderSchema } from "./schemas/purchase-order.schema";
import { RFQ, RFQSchema } from "../rfq/schemas/rfq.schema";
import { PurchaseOrdersController } from "./purchase-orders.controller";
import { PurchaseOrdersService } from "./purchase-orders.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PurchaseOrder.name, schema: PurchaseOrderSchema },
      { name: RFQ.name, schema: RFQSchema }
    ])
  ],
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService],
  exports: [PurchaseOrdersService]
})
export class PurchaseOrdersModule {}