import { Routes } from '@angular/router'
import { ProcurementLayoutComponent } from './layout/procurement-layout.component'
import { PRListComponent } from './purchase-requests/pr-list.component'
import { RfqListComponent } from './rfq/rfq-list.component'
import { POListComponent } from './purchase-orders/po-list.component'
import { GRNListComponent } from './grn/grn-list.component'

export const PROCUREMENT_ROUTES: Routes = [
  {
    path: '',
    component: ProcurementLayoutComponent,
    children: [
      { path: '', redirectTo: 'purchase-requests', pathMatch: 'full' },
      { path: 'purchase-requests', component: PRListComponent },
      { path: 'rfq', component: RfqListComponent },
      { path: 'purchase-orders', component: POListComponent },
      { path: 'grn', component: GRNListComponent }

    ]
  }
]