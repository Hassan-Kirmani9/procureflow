import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TagModule } from "primeng/tag";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { PurchaseRequestsApiService } from "../../../core/services/purchase-requests.service";

@Component({
  standalone: true,
  selector: 'app-requester-dashboard',
  templateUrl: './requester-dashboard.component.html',
  imports: [
    CommonModule,
    RouterModule,
    TagModule,
    TableModule,
    ButtonModule
  ]
})
export class RequesterDashboardComponent implements OnInit {

  totalPRs = 0
  approvedPRs = 0
  pendingPRs = 0
  rejectedPRs = 0
  recentPRs: any[] = []

  constructor(
    private prService: PurchaseRequestsApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadPRs() }

  loadPRs() {
    this.prService.getMyPRs().subscribe({
      next: (data) => {
        this.totalPRs = data.length
        this.approvedPRs = data.filter((pr: any) => pr.status === 'approved').length
        this.pendingPRs = data.filter((pr: any) => pr.status === 'submitted').length
        this.rejectedPRs = data.filter((pr: any) => pr.status === 'rejected').length
        this.recentPRs = data.slice(0, 5)
        this.cdr.detectChanges()
      },
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