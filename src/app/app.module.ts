import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BodyComponent } from './components/body/body.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';
import { CustomersComponent } from './components/customers/customers.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ReportsComponent } from './components/reports/reports.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CompanyComponent } from './components/company/company.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReceiptComponent } from './components/receipt/receipt.component';
import { TaxComponent } from './components/reports/tax/tax.component';
import { TaxRatesComponent } from './components/taxrates/taxrates.component';
import { TaxRateDetailsComponent } from './components/taxrate-details/taxrate-details.component';
import { ConfigComponent } from './components/config/config.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthInterceptor } from './services/auth-interpreter-service';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    BodyComponent,
    NavbarComponent,
    DashboardComponent,
    OrdersComponent,
    ProductsComponent,
    CustomersComponent,
    SettingsComponent,
    ReportsComponent,
    OrderDetailsComponent,
    CustomerDetailsComponent,
    ProductDetailsComponent,
    CompanyComponent,
    ReceiptComponent,
    TaxComponent,
    TaxRatesComponent,
    TaxRateDetailsComponent,
    AuthComponent,
    ConfigComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
