export class SubmitQuoteDto {
  unitPrice: number
  totalPrice: number
  deliveryDays: number
  paymentTerms?: string
  notes?: string
}