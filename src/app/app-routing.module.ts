import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ProductsComponent } from './components/products/products.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';


const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'orders', component: OrdersComponent},
  {path: 'orders/edit', component: OrderDetailsComponent},
  {path: 'orders/new', component: OrderDetailsComponent},
  {path: 'clients/suppliers', component: ClientsComponent},
  {path: 'clients/customers', component: ClientsComponent},
  {path: 'products', component: ProductsComponent},
  {path: 'reports', component: ReportsComponent},
  {path: 'settings', component: SettingsComponent},
  {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
