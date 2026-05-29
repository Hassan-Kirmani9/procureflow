import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { DialogModule } from "primeng/dialog";
import { PurchaseOrdersApiService } from "../../../core/services/purchase-orders.service";
import { RfqApiService } from "../../../core/services/rfq.service";

@Component({
  standalone: true,
  selector: 'app-po-list',
  templateUrl: './po-list.component.html',
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    TagModule,
    DialogModule
  ]
})
export class POListComponent implements OnInit {

  pos: any[] = []
  awardedRfqs: any[] = []
  loading = false
  selectedPO: any = null
  showDetailDialog = false

  constructor(
    private poService: PurchaseOrdersApiService,
    private rfqService: RfqApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadPOs()
    this.loadAwardedRfqs()
  }

  loadPOs() {
    this.loading = true
    this.poService.getAll().subscribe({
      next: (data) => {
        this.pos = data
        this.loading = false
        this.cdr.detectChanges()
      },
      error: (err) => { console.error(err); this.loading = false }
    })
  }

  loadAwardedRfqs() {
    this.rfqService.getAll().subscribe({
      next: (data) => {
        this.awardedRfqs = data.filter((r: any) => r.status === 'awarded')
        this.cdr.detectChanges()
      },
      error: (err) => console.error(err)
    })
  }

  createPOFromRfq(rfqId: string) {
    this.poService.createFromRfq(rfqId).subscribe({
      next: () => this.loadPOs(),
      error: (err) => console.error(err)
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

  approve(id: string) {
    this.poService.approve(id).subscribe({
      next: () => { this.showDetailDialog = false; this.loadPOs() },
      error: (err) => console.error(err)
    })
  }

  cancel(id: string) {
    this.poService.cancel(id).subscribe({
      next: () => { this.showDetailDialog = false; this.loadPOs() },
      error: (err) => console.error(err)
    })
  }

  getSeverity(status: string) {
    const map: any = {
      pending: 'warn',
      approved: 'info',
      sent: 'info',
      acknowledged: 'success',
      completed: 'success',
      cancelled: 'danger'
    }
    return map[status] || 'info'
  }
}