export class CreateRfqDto {
  purchaseRequestId: string
  title: string
  description: string
  quantity: number
  deadline: Date
  invitedSuppliers: string[]
}