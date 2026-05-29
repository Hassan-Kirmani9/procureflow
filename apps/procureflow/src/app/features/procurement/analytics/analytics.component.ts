import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChartModule } from "primeng/chart";
import { CardModule } from "primeng/card";
import { TagModule } from "primeng/tag";
import { TableModule } from "primeng/table";
import { PurchaseRequestsApiService } from "../../../core/services/purchase-requests.service";
import { PurchaseOrdersApiService } from "../../../core/services/purchase-orders.service";
import { BudgetsApiService } from "../../../core/services/budgets.service";
import { SuppliersApiService } from "../../../core/services/suppliers.service";

@Component({
  standalone: true,
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  imports: [
    CommonModule,
    ChartModule,
    CardModule,
    TagModule,
    TableModule
  ]
})
export class AnalyticsComponent implements OnInit {

  // Stats
  totalPRs = 0
  approvedPRs = 0
  totalPOs = 0
  totalBudget = 0
  totalCommitted = 0

  // Chart data
  prStatusChartData: any = {}
  spendChartData: any = {}
  budgetChartData: any = {}

  chartOptions = {
    plugins: {
      legend: { position: 'bottom' }
    },
    responsive: true,
    maintainAspectRatio: false
  }

  barChartOptions = {
    plugins: {
      legend: { position: 'bottom' }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true }
    }
  }

  // Tables
  recentPOs: any[] = []
  budgets: any[] = []
  suppliers: any[] = []

  loading = false

  constructor(
    private prService: PurchaseRequestsApiService,
    private poService: PurchaseOrdersApiService,
    private budgetsService: BudgetsApiService,
    private suppliersService: SuppliersApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAll()
  }

  loadAll() {
    this.loading = true
    this.loadPRs()
    this.loadPOs()
    this.loadBudgets()
    this.loadSuppliers()
  }

  loadPRs() {
    this.prService.getAll().subscribe({
      next: (data) => {
        this.totalPRs = data.length
        this.approvedPRs = data.filter((pr: any) => pr.status === 'approved').length

        const statusCounts: any = {}
        data.forEach((pr: any) => {
          statusCounts[pr.status] = (statusCounts[pr.status] || 0) + 1
        })

        this.prStatusChartData = {
          labels: Object.keys(statusCounts),
          datasets: [{
            data: Object.values(statusCounts),
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
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

        const monthlySpend: any = {}
        data.forEach((po: any) => {
          const month = new Date(po.createdAt).toLocaleString('default', { month: 'short' })
          monthlySpend[month] = (monthlySpend[month] || 0) + po.totalAmount
        })

        this.spendChartData = {
          labels: Object.keys(monthlySpend),
          datasets: [{
            label: 'Spend',
            data: Object.values(monthlySpend),
            backgroundColor: '#3B82F6',
            borderColor: '#2563EB',
            borderWidth: 2,
            fill: false,
            tension: 0.4
          }]
        }
        this.cdr.detectChanges()
      },
      error: (err) => console.error(err)
    })
  }

  loadBudgets() {
    this.budgetsService.getAllWithUtilization().subscribe({
      next: (data) => {
        this.budgets = data
        this.totalBudget = data.reduce((sum: number, b: any) => sum + b.totalAmount, 0)
        this.totalCommitted = data.reduce((sum: number, b: any) => sum + b.committedAmount, 0)

        this.budgetChartData = {
          labels: data.map((b: any) => b.department),
          datasets: [
            {
              label: 'Total Budget',
              data: data.map((b: any) => b.totalAmount),
              backgroundColor: '#10B981'
            },
            {
              label: 'Committed',
              data: data.map((b: any) => b.committedAmount),
              backgroundColor: '#F59E0B'
            },
            {
              label: 'Actual Spend',
              data: data.map((b: any) => b.actualSpend),
              backgroundColor: '#EF4444'
            }
          ]
        }
        this.cdr.detectChanges()
      },
      error: (err) => console.error(err)
    })
  }

  loadSuppliers() {
    this.suppliersService.getAll().subscribe({
      next: (data) => {
        this.suppliers = data
        this.loading = false
        this.cdr.detectChanges()
      },
      error: (err) => { console.error(err); this.loading = false }
    })
  }

  getPoSeverity(status: string) {
    const map: any = {
      pending: 'warn',
      approved: 'info',
      acknowledged: 'success',
      completed: 'success',
      cancelled: 'danger'
    }
    return map[status] || 'info'
  }

  getSupplierSeverity(status: string) {
    const map: any = {
      pending: 'warn',
      verified: 'success',
      blacklisted: 'danger'
    }
    return map[status] || 'info'
  }
}