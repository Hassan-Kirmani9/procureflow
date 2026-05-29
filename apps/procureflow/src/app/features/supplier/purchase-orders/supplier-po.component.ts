import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { DialogModule } from "primeng/dialog";
import { PurchaseOrdersApiService } from "../../../core/services/purchase-orders.service";

@Component({
  standalone: true,
  selector: 'app-supplier-po',
  templateUrl: './supplier-po.component.html',
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    TagModule,
    DialogModule
  ]
})
export class SupplierPOComponent implements OnInit {

  pos: any[] = []
  loading = false
  selectedPO: any = null
  showDetailDialog = false

  constructor(
    private poService: PurchaseOrdersApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadOrders() }

  loadOrders() {
    this.loading = true
    this.poService.getMyOrders().subscribe({
      next: (data) => {
        this.pos = data
        this.loading = false
        this.cdr.detectChanges()
      },
      error: (err) => { console.error(err); this.loading = false }
    })
  }

  viewDetail(po: any) {
    this.poService.getById(po._id).subscribe({
      next: (data) => {
        this.selectedPO = data
        this.showDetailDialog = true
        this.cdr.detectChanges()
      },
      error: (err) => console.error(err)
    })
  }

  acknowledge(id: string) {
    this.poService.acknowledge(id).subscribe({
      next: () => { this.showDetailDialog = false; this.loadOrders() },
      error: (err) => console.error(err)
    })
  }

  getSeverity(status: string) {
    const map: any = {
      pending: 'warn',
      approved: 'info',
      acknowledged: 'success',
      completed: 'success',
      cancelled: 'danger'
    }
    return map[status] || 'info'
  }
}