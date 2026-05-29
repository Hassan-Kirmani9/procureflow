import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { TagModule } from "primeng/tag";
import { SelectModule } from "primeng/select";
import { GrnApiService } from "../../../core/services/grn.service";
import { PurchaseOrdersApiService } from "../../../core/services/purchase-orders.service";

@Component({
  standalone: true,
  selector: 'app-grn-list',
  templateUrl: './grn-list.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    TagModule,
    SelectModule
  ]
})
export class GRNListComponent implements OnInit {

  grns: any[] = []
  approvedPOs: any[] = []
  loading = false
  showDialog = false

  form = new FormGroup({
    purchaseOrderId: new FormControl(''),
    quantityOrdered: new FormControl(0),
    quantityReceived: new FormControl(0),
    receivedBy: new FormControl(''),
    discrepancyNotes: new FormControl('')
  })

  constructor(
    private grnService: GrnApiService,
    private poService: PurchaseOrdersApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadGRNs()
    this.loadApprovedPOs()
  }

  loadGRNs() {
    this.loading = true
    this.grnService.getAll().subscribe({
      next: (data) => {
        this.grns = data
        this.loading = false
        this.cdr.detectChanges()
      },
      error: (err) => { console.error(err); this.loading = false }
    })
  }

  loadApprovedPOs() {
    this.poService.getAll().subscribe({
      next: (data) => {
        this.approvedPOs = data.filter((po: any) =>
          po.status === 'approved' || po.status === 'acknowledged'
        )
        this.cdr.detectChanges()
      },
      error: (err) => console.error(err)
    })
  }

  openDialog() {
    this.showDialog = true
    this.form.reset()
  }

  createGRN() {
    this.grnService.create(this.form.value).subscribe({
      next: () => { this.showDialog = false; this.loadGRNs() },
      error: (err) => console.error(err)
    })
  }

  getSeverity(status: string) {
    const map: any = {
      full: 'success',
      partial: 'warn',
      discrepancy: 'danger'
    }
    return map[status] || 'info'
  }
}