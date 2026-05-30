import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TagModule } from "primeng/tag";
import { TableModule } from "primeng/table";
import { ChartModule } from "primeng/chart";
import { ButtonModule } from "primeng/button";
import { PurchaseRequestsApiService } from "../../../core/services/purchase-requests.service";
import { PurchaseOrdersApiService } from "../../../core/services/purchase-orders.service";
import { RfqApiService } from "../../../core/services/rfq.service";
import { BudgetsApiService } from "../../../core/services/budgets.service";

@Component({
  standalone: true,
  selector: 'app-procurement-dashboard',
  templateUrl: './procurement-dashboard.component.html',
  imports: [
    CommonModule,
    RouterModule,
    TagModule,
    TableModule,
    ChartModule,
    ButtonModule
  ]
})
export class ProcurementDashboardComponent implements OnInit {

  totalPRs = 0
  pendingPRs = 0
  totalPOs = 0
  openRFQs = 0
  totalBudget = 0
  totalCommitted = 0

  recentPRs: any[] = []
  recentPOs: any[] = []

  prStatusChartData: any = {}
  budgetChartData: any = {}

  chartOptions = {
    plugins: { legend: { position: 'bottom' } },
    responsive: true,
    maintainAspectRatio: false
  }

  barChartOptions = {
    plugins: { legend: { position: 'bottom' } },
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } }
  }

  constructor(
    private prService: PurchaseRequestsApiService,
    private poService: PurchaseOrdersApiService,
    private rfqService: RfqApiService,
    private budgetsService: BudgetsApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadPRs()
    this.loadPOs()
    this.loadRFQs()
    this.loadBudgets()
  }

  loadPRs() {
    this.prService.getAll().subscribe({
      next: (data) => {
        this.totalPRs = data.length
        this.pendingPRs = data.filter((pr: any) => pr.status === 'submitted').length
        this.recentPRs = data.slice(0, 5)

        const statusCounts: any = {}
        data.forEach((pr: any) => {
          statusCounts[pr.status] = (statusCounts[pr.status] || 0) + 1
        })
        this.prStatusChartData = {
          labels: Object.keys(statusCounts),
          datasets: [{
            data: Object.values(statusCounts),
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
            borderWidth: 0
          }]
        }
        this.cdr.detectChanges()
      },
      error: (err) => console.error(err)
    })
  }

  loadPOs() {
    this.poService.getAll().subscribe({
      next: (data) => {
        this.totalPOs = data.length
        this.recentPOs = data.slice(0, 5)
        this.cdr.detectChanges()
      },
      error: (err) => console.error(err)
    })
  }

  loadRFQs() {
    this.rfqService.getAll().subscribe({
      next: (data) => {
        this.openRFQs = data.filter((r: any) => r.status === 'open').length
        this.cdr.detectChanges()
      },
      error: (err) => console.error(err)
    })
  }

  loadBudgets() {
    this.budgetsService.getAllWithUtilization().subscribe({
      next: (data) => {
        this.totalBudget = data.reduce((sum: number, b: any) => sum + b.totalAmount, 0)
        this.totalCommitted = data.reduce((sum: number, b: any) => sum + b.committedAmount, 0)
        this.budgetChartData = {
          labels: data.map((b: any) => b.department),
          datasets: [
            {
              label: 'Total Budget',
              data: data.map((b: any) => b.totalAmount),
              backgroundColor: '#10B981',
              borderRadius: 6
            },
            {
              label: 'Committed',
              data: data.map((b: any) => b.committedAmount),
              backgroundColor: '#F59E0B',
              borderRadius: 6
            }
          ]
        }
        this.cdr.detectChanges()
      },
      error: (err) => console.error(err)
    })
  }

  getPRSeverity(status: string) {
    const map: any = {
      draft: 'secondary',
      submitted: 'info',
      under_review: 'warn',
      approved: 'success',
      rejected: 'danger'
    }
    return map[status] || 'info'
  }

  getPOSeverity(status: string) {
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