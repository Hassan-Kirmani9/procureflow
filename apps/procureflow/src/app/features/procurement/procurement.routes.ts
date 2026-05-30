import { Routes } from '@angular/router'
import { ProcurementLayoutComponent } from './layout/procurement-layout.component'
import { PRListComponent } from './purchase-requests/pr-list.component'
import { RfqListComponent } from './rfq/rfq-list.component'
import { POListComponent } from './purchase-orders/po-list.component'
import { GRNListComponent } from './grn/grn-list.component'
import { InvoicesComponent } from './invoices/invoices.component'
import { SuppliersComponent } from './suppliers/suppliers.component'
import { BudgetOverviewComponent } from './budgets/budget-overview.component'
import { AnalyticsComponent } from './analytics/analytics.component'
import { ProcurementDashboardComponent } from './dashboard/procurement-dashboard.component'

export const PROCUREMENT_ROUTES: Routes = [
  {
    path: '',
    component: ProcurementLayoutComponent,
    children: [
      { path: '', redirectTo: 'purchase-requests', pathMatch: 'full' },
      { path: 'purchase-requests', component: PRListComponent },
      { path: 'rfq', component: RfqListComponent },
      { path: 'purchase-orders', component: POListComponent },
      { path: 'grn', component: GRNListComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'suppliers', component: SuppliersComponent },
      { path: 'budgets', component: BudgetOverviewComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'dashboard', component: ProcurementDashboardComponent }


    ]
  }
]