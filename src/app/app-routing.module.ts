import { Company } from './models/company.model';
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
import { ReceiptComponent } from './components/receipt/receipt.component';
import { CompanyComponent } from './components/company/company.component';


const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'orders', component: OrdersComponent},
  {path: 'orders/:mode', component: OrderDetailsComponent},
  {path: 'clients/:type', component: CustomersComponent, pathMatch: 'full'},
  {path: 'clients/:type/:mode', component: CustomerDetailsComponent, pathMatch: 'full'},
  {path: 'clients/:type/edit', component: CustomerDetailsComponent, pathMatch: 'full'},
  {path: 'products', component: ProductsComponent},
  {path: 'products/:mode', component: ProductDetailsComponent},
  {path: 'reports', component: ReportsComponent},
  {path: 'receipt', component: ReceiptComponent},
  {path: 'settings', component: CompanyComponent},
  {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
