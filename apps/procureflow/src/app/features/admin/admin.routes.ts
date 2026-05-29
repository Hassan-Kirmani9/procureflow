import { Routes } from '@angular/router'
import { AdminLayoutComponent } from './layout/admin-layout.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { UsersComponent } from './users/users.component'

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
    ]
  }
]