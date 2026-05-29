export class CreateInvoiceDto {
  purchaseOrderId: string
  amount: number
  dueDate: Date
  notes?: string
}