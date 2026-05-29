import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { TagModule } from "primeng/tag";
import { InvoicesApiService } from "../../../core/services/invoices.service";

@Component({
  standalone: true,
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
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
export class InvoicesComponent implements OnInit {

  invoices: any[] = []
  loading = false
  selectedInvoice: any = null
  showDetailDialog = false
  showRejectDialog = false

  rejectForm = new FormGroup({
    reason: new FormControl('')
  })

  constructor(
    private invoicesService: InvoicesApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadInvoices() }

  loadInvoices() {
    this.loading = true
    this.invoicesService.getAll().subscribe({
      next: (data) => {
        this.invoices = data
        this.loading = false
        this.cdr.detectChanges()
      },
      error: (err) => { console.error(err); this.loading = false }
    })
  }

  viewDetail(invoice: any) {
    this.invoicesService.getById(invoice._id).subscribe({
      next: (data) => {
        this.selectedInvoice = data
        this.showDetailDialog = true
        this.cdr.detectChanges()
      },
      error: (err) => console.error(err)
    })
  }

  approve(id: string) {
    this.invoicesService.approve(id).subscribe({
      next: () => { this.showDetailDialog = false; this.loadInvoices() },
      error: (err) => console.error(err)
    })
  }

  openRejectDialog() {
    this.showRejectDialog = true
    this.rejectForm.reset()
  }

  reject() {
    const reason = this.rejectForm.value.reason || ''
    this.invoicesService.reject(this.selectedInvoice._id, reason).subscribe({
      next: () => {
        this.showRejectDialog = false
        this.showDetailDialog = false
        this.loadInvoices()
      },
      error: (err) => console.error(err)
    })
  }

  markAsPaid(id: string) {
    this.invoicesService.markAsPaid(id).subscribe({
      next: () => { this.showDetailDialog = false; this.loadInvoices() },
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