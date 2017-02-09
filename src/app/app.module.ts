import {NgModule} from '@angular/core'
import {RouterModule} from "@angular/router";
import {rootRouterConfig} from "./app.routes";
import {AppComponent} from "./app.component";
import {ApiService, KeysPipe, ValuesPipe, QuantityParsePipe, ClientParsePipe, SearchFilterPipe, MyClients, ClientsService, StoreHelper, HubSpotAPIService} from './services';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule, DomSanitizer} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";

// Experimental Start
import {Gravatar} from 'ng2-gravatar-directive';
import {Ng2FilterPipeModule} from 'ng2-filter-pipe';
import {BusyModule} from 'angular2-busy';
// Experimental End

import {providers} from './index';
import {Test, PageNotFound, Home, CompanyDetails, TokenDisplay} from './ui';
import {Main, Auth, UserProfile, ScopeDisplay, ClientsDisplay, DealsDisplay, CompaniesDisplay} from './containers';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

@NgModule({
  declarations: [
    Test, 
    PageNotFound, 
    AppComponent, 
    Home, 
    CompanyDetails, 
    TokenDisplay, 
    Main, 
    Auth, 
    UserProfile, 
    ScopeDisplay, 
    ClientsDisplay, 
    CompaniesDisplay, 
    DealsDisplay, 
    KeysPipe, 
    ValuesPipe, 
    QuantityParsePipe, 
    ClientParsePipe, 
    SearchFilterPipe, 
    Gravatar
    ],
  imports     : [
    BrowserModule, 
    FormsModule, 
    HttpModule, 
    RouterModule.forRoot(rootRouterConfig), 
    ReactiveFormsModule, 
    Ng2FilterPipeModule,
    BusyModule
    ],
  providers   : [
    ApiService, 
    MyClients, 
    ClientsService, 
    HubSpotAPIService, 
    ...providers, 
    {
      provide: LocationStrategy, 
      useClass: HashLocationStrategy
    }
    ],
  bootstrap   : [AppComponent]
})
export class AppModule {
  
}
