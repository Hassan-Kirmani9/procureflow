import { Routes } from '@angular/router'
import { RequesterLayoutComponent } from './layout/requester-layout.component'
import { PRComponent } from './purchase-requests/pr.component'
import { RequesterDashboardComponent } from './dashboard/requester-dashboard.component'

export const REQUESTER_ROUTES: Routes = [
  {
    path: '',
    component: RequesterLayoutComponent,
    children: [
      { path: '', redirectTo: 'purchase-requests', pathMatch: 'full' },
      { path: 'purchase-requests', component: PRComponent },
      { path: 'dashboard', component: RequesterDashboardComponent }

    ]
  }
]