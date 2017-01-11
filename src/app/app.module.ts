import {NgModule} from '@angular/core'
import {RouterModule} from "@angular/router";
import {rootRouterConfig} from "./app.routes";
import {AppComponent} from "./app.component";
import {ApiService, KeysPipe, ValuesPipe, QuantityParsePipe, ClientParsePipe, SearchFilterPipe, MyClients, ClientsService, StoreHelper, HubSpotAPIService} from './services';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule, DomSanitizer} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {providers} from './index';
import {Test, Home, ClientDetails} from './ui';
import {Main, Auth, UserProfile, ScopeDisplay, ClientsDisplay} from './containers';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {DragulaService, DragulaDirective, DragulaModule} from 'ng2-dragula/ng2-dragula';
import * as io from "socket.io-client";

@NgModule({
  declarations: [Test, AppComponent, Home, ClientDetails, Main, Auth, UserProfile, ScopeDisplay, ClientsDisplay, KeysPipe, ValuesPipe, QuantityParsePipe, ClientParsePipe, SearchFilterPipe],
  imports     : [BrowserModule, FormsModule, HttpModule, RouterModule.forRoot(rootRouterConfig), DragulaModule, ReactiveFormsModule],
  providers   : [ApiService, MyClients, ClientsService, HubSpotAPIService, ...providers, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap   : [AppComponent]
})
export class AppModule {
  
}
