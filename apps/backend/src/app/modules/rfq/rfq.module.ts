import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RFQ, RFQSchema } from "./schemas/rfq.schema";
import { RfqController } from "./rfq.controller";
import { RfqService } from "./rfq.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RFQ.name, schema: RFQSchema }])
  ],
  controllers: [RfqController],
  providers: [RfqService],
  exports: [RfqService]
})
export class RfqModule {}