export class CreateSupplierDto {
  userId: string
  companyName: string
  contactEmail: string
  phone?: string
  address?: string
  categories?: string[]
  notes?: string
}