import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PurchaseRequest, PurchaseRequestSchema } from "./schemas/purchase-request.schema";
import { PurchaseRequestsController } from "./purchase-requests.controller";
import { PurchaseRequestsService } from "./purchase-requests.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PurchaseRequest.name, schema: PurchaseRequestSchema }])
  ],
  controllers: [PurchaseRequestsController],
  providers: [PurchaseRequestsService],
  exports: [PurchaseRequestsService]
})
export class PurchaseRequestsModule {}