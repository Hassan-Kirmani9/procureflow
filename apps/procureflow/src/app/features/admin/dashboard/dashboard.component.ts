import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ChartModule } from "primeng/chart";
import { UsersApiService } from "../users/users.service";
import { DepartmentsApiService } from "../departments/departments.service";
import { BudgetsApiService } from "../../../core/services/budgets.service";

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TableModule,
    TagModule,
    ChartModule
  ]
})
export class DashboardComponent implements OnInit {

  totalUsers = 0
  totalDepartments = 0
  totalBudget = 0
  recentUsers: any[] = []
  departments: any[] = []
  budgets: any[] = []

  roleStats = {
    super_admin: 0,
    procurement_manager: 0,
    requester: 0,
    supplier: 0
  }

  roleChartData: any = {}
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
    private usersService: UsersApiService,
    private deptService: DepartmentsApiService,
    private budgetsService: BudgetsApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUsers()
    this.loadDepartments()
    this.loadBudgets()
  }

  loadUsers() {
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.totalUsers = data.length
        this.recentUsers = data.slice(0, 5)
        this.roleStats = {
          super_admin: data.filter((u: any) => u.role === 'super_admin').length,
          procurement_manager: data.filter((u: any) => u.role === 'procurement_manager').length,
          requester: data.filter((u: any) => u.role === 'requester').length,
          supplier: data.filter((u: any) => u.role === 'supplier').length,
        }
        this.roleChartData = {
          labels: ['Super Admin', 'Procurement Manager', 'Requester', 'Supplier'],
          datasets: [{
            data: [
              this.roleStats.super_admin,
              this.roleStats.procurement_manager,
              this.roleStats.requester,
              this.roleStats.supplier
            ],
            backgroundColor: ['#EF4444', '#3B82F6', '#10B981', '#8B5CF6'],
            borderWidth: 0
          }]
        }
        this.cdr.detectChanges()
      },
      error: (err) => console.error(err)
    })
  }

  loadDepartments() {
    this.deptService.getDepartments().subscribe({
      next: (data) => {
        this.totalDepartments = data.length
        this.departments = data
        this.cdr.detectChanges()
      },
      error: (err) => console.error(err)
    })
  }

  loadBudgets() {
    this.budgetsService.getAllWithUtilization().subscribe({
      next: (data) => {
        this.totalBudget = data.reduce((sum: number, b: any) => sum + b.totalAmount, 0)
        this.budgets = data
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

  getRoleSeverity(role: string) {
    const map: any = {
      super_admin: 'danger',
      procurement_manager: 'info',
      requester: 'success',
      supplier: 'warn'
    }
    return map[role] || 'info'
  }

  getUserSeverity(isActive: boolean) {
    return isActive ? 'success' : 'danger'
  }
}