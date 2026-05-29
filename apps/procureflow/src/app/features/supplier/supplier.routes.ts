import { Routes } from '@angular/router'
import { SupplierLayoutComponent } from './layout/supplier-layout.component'
import { SupplierRfqComponent } from './rfq/supplier-rfq.component'
import { SupplierPOComponent } from './purchase-orders/supplier-po.component'

export const SUPPLIER_ROUTES: Routes = [
  {
    path: '',
    component: SupplierLayoutComponent,
    children: [
      { path: '', redirectTo: 'rfq', pathMatch: 'full' },
      { path: 'rfq', component: SupplierRfqComponent },
      { path: 'purchase-orders', component: SupplierPOComponent },
    ]
  }
]