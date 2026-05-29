export class CreateGrnDto {
  purchaseOrderId: string
  quantityOrdered: number
  quantityReceived: number
  discrepancyNotes?: string
  receivedBy: string
}