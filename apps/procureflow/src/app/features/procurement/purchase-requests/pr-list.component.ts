import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { ReactiveFormsModule, FormControl, FormGroup } from "@angular/forms";
import { PurchaseRequestsApiService } from "../../../core/services/purchase-requests.service";

@Component({
  standalone: true,
  selector: 'app-pr-list',
  templateUrl: './pr-list.component.html',
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    TagModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule
  ]
})
export class PRListComponent implements OnInit {

  prs: any[] = []
  loading = false
  showRejectDialog = false
  selectedPR: any = null

  rejectForm = new FormGroup({
    rejectionReason: new FormControl('')
  })

  constructor(private prService: PurchaseRequestsApiService) {}

  ngOnInit() { this.loadPRs() }

  loadPRs() {
    this.loading = true
    this.prService.getAll().subscribe({
      next: (data) => { this.prs = data; this.loading = false },
      error: (err) => { console.error(err); this.loading = false }
    })
  }

  approve(id: string) {
    this.prService.updateStatus(id, 'approved', 'Approved by procurement manager').subscribe({
      next: () => this.loadPRs(),
      error: (err) => console.error(err)
    })
  }

  openRejectDialog(pr: any) {
    this.selectedPR = pr
    this.showRejectDialog = true
    this.rejectForm.reset()
  }

  reject() {
    const reason = this.rejectForm.value.rejectionReason || ''
    this.prService.updateStatus(this.selectedPR._id, 'rejected', reason, reason).subscribe({
      next: () => { this.showRejectDialog = false; this.loadPRs() },
      error: (err) => console.error(err)
    })
  }

  getSeverity(status: string) {
    const map: any = {
      draft: 'secondary',
      submitted: 'info',
      under_review: 'warn',
      approved: 'success',
      rejected: 'danger'
    }
    return map[status] || 'info'
  }
}