import { Routes } from '@angular/router'
import { ProcurementLayoutComponent } from './layout/procurement-layout.component'
import { PRListComponent } from './purchase-requests/pr-list.component'

export const PROCUREMENT_ROUTES: Routes = [
  {
    path: '',
    component: ProcurementLayoutComponent,
    children: [
      { path: '', redirectTo: 'purchase-requests', pathMatch: 'full' },
      { path: 'purchase-requests', component: PRListComponent },
    ]
  }
]