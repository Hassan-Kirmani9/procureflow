import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { TagModule } from "primeng/tag";
import { RfqApiService } from "../../../core/services/rfq.service";
import { PurchaseRequestsApiService } from "../../../core/services/purchase-requests.service";
import { UsersApiService } from "../../admin/users/users.service";

@Component({
  standalone: true,
  selector: 'app-rfq-list',
  templateUrl: './rfq-list.component.html',
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
export class RfqListComponent implements OnInit {

  rfqs: any[] = []
  approvedPRs: any[] = []
  suppliers: any[] = []
  loading = false
  showDialog = false
  selectedRfq: any = null
  showBidDialog = false

  form = new FormGroup({
    purchaseRequestId: new FormControl(''),
    title: new FormControl(''),
    description: new FormControl(''),
    quantity: new FormControl(1),
    deadline: new FormControl(''),
    invitedSuppliers: new FormControl([])
  })

constructor(
  private rfqService: RfqApiService,
  private prService: PurchaseRequestsApiService,
  private usersService: UsersApiService,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit() {
    this.loadRfqs()
    this.loadApprovedPRs()
    this.loadSuppliers()
  }

  loadRfqs() {
  this.loading = true
  this.rfqService.getAll().subscribe({
    next: (data) => { this.rfqs = data; this.loading = false; this.cdr.detectChanges() },
    error: (err) => { console.error(err); this.loading = false }
  })
}

loadApprovedPRs() {
  this.prService.getAll().subscribe({
    next: (data) => {
      this.approvedPRs = data.filter((pr: any) => pr.status === 'approved')
      this.cdr.detectChanges()
    },
    error: (err) => console.error(err)
  })
}

loadSuppliers() {
  this.usersService.getUsers().subscribe({
    next: (data) => {
      this.suppliers = data.filter((u: any) => u.role === 'supplier')
      this.cdr.detectChanges()
    },
    error: (err) => console.error(err)
  })
}

  openDialog() {
    this.showDialog = true
    this.form.reset({ quantity: 1 })
  }

  createRfq() {
    this.rfqService.create(this.form.value).subscribe({
      next: () => { this.showDialog = false; this.loadRfqs() },
      error: (err) => console.error(err)
    })
  }

  viewBids(rfq: any) {
    this.rfqService.getById(rfq._id).subscribe({
      next: (data) => { this.selectedRfq = data; this.showBidDialog = true },
      error: (err) => console.error(err)
    })
  }

  selectWinner(supplierId: string) {
    this.rfqService.selectWinner(this.selectedRfq._id, supplierId).subscribe({
      next: () => { this.showBidDialog = false; this.loadRfqs() },
      error: (err) => console.error(err)
    })
  }

  getSeverity(status: string) {
    const map: any = {
      draft: 'secondary',
      open: 'info',
      closed: 'warn',
      awarded: 'success'
    }
    return map[status] || 'info'
  }
}