import { Routes } from '@angular/router';

export const appRoutes: Routes = [

    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },


    { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },


    { path: 'admin', loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES) },


    // { path: 'procurement', loadChildren: () => import('./features/procurement/procurement.routes').then(m => m.PROCUREMENT_ROUTES) },


    // { path: 'requester', loadChildren: () => import('./features/requester/requester.routes').then(m => m.REQUESTER_ROUTES) },


    // { path: 'supplier', loadChildren: () => import('./features/supplier/supplier.routes').then(m => m.SUPPLIER_ROUTES) },
];