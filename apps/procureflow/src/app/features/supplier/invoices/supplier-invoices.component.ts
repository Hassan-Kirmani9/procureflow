import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { TagModule } from "primeng/tag";
import { InvoicesApiService } from "../../../core/services/invoices.service";
import { PurchaseOrdersApiService } from "../../../core/services/purchase-orders.service";

@Component({
  standalone: true,
  selector: 'app-supplier-invoices',
  templateUrl: './supplier-invoices.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    TagModule
  ]
})
export class SupplierInvoicesComponent implements OnInit {

  invoices: any[] = []
  myPOs: any[] = []
  loading = false
  showDialog = false

  form = new FormGroup({
    purchaseOrderId: new FormControl(''),
    amount: new FormControl(0),
    dueDate: new FormControl(''),
    notes: new FormControl('')
  })

  constructor(
    private invoicesService: InvoicesApiService,
    private poService: PurchaseOrdersApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadInvoices()
    this.loadMyPOs()
  }

  loadInvoices() {
    this.loading = true
    this.invoicesService.getMyInvoices().subscribe({
      next: (data) => {
        this.invoices = data
        this.loading = false
        this.cdr.detectChanges()
      },
      error: (err) => { console.error(err); this.loading = false }
    })
  }

  loadMyPOs() {
    this.poService.getMyOrders().subscribe({
      next: (data) => {
        this.myPOs = data.filter((po: any) =>
          po.status === 'acknowledged' || po.status === 'completed'
        )
        this.cdr.detectChanges()
      },
      error: (err) => console.error(err)
    })
  }

  openDialog() {
    this.showDialog = true
    this.form.reset({ amount: 0 })
  }

  submitInvoice() {
    this.invoicesService.create(this.form.value).subscribe({
      next: () => { this.showDialog = false; this.loadInvoices() },
      error: (err) => console.error(err)
    })
  }

  getSeverity(status: string) {
    const map: any = {
      pending: 'warn',
      approved: 'info',
      rejected: 'danger',
      paid: 'success'
    }
    return map[status] || 'info'
  }
}