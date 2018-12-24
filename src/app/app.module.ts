import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BodyComponent } from './components/body/body.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';
import { ClientsComponent } from './components/clients/clients.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ReportsComponent } from './components/reports/reports.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { ClientDetailsComponent } from './components/client-details/client-details.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    BodyComponent,
    NavbarComponent,
    DashboardComponent,
    OrdersComponent,
    ProductsComponent,
    ClientsComponent,
    SettingsComponent,
    ReportsComponent,
    OrderDetailsComponent,
    ClientDetailsComponent,
    ProductDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
