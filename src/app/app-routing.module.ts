import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CustomersComponent } from './components/customers/customers.component';
import { ProductsComponent } from './components/products/products.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';


const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'orders', component: OrdersComponent},
  {path: 'orders/:option', component: OrderDetailsComponent},
  {path: 'clients/:type', component: CustomersComponent, pathMatch: 'full'},
  {path: 'clients/:type/:option', component: CustomerDetailsComponent, pathMatch: 'full'},
  {path: 'clients/:type/edit', component: CustomerDetailsComponent, pathMatch: 'full'},
  {path: 'products', component: ProductsComponent},
  {path: 'products/:option', component: ProductDetailsComponent},
  {path: 'reports', component: ReportsComponent},
  {path: 'settings', component: SettingsComponent},
  {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
