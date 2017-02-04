import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService, StoreHelper, AuthService, ScopeService } from '../../services'
import { Store } from '../../store';
declare var CONFIG: any;
var _ = require('lodash');
declare var swal;

@Component({
  selector: 'company-details',
  styles: [require('./company-details.component.css')],
  template: require('./company-details.component.html')
})
export class CompanyDetails implements OnInit {

  constructor(
    private location: Location, 
    private router: Router, 
    private route: ActivatedRoute, 
    private apiService: ApiService, 
    private storeHelper: StoreHelper, 
    private authService: AuthService, 
    private store: Store,
    private scopeService: ScopeService
    ) { }
  id: number;
  private sub: any;
  companies: Array<any>;
  company: Object;
  scopes: Array<Object>;

  ngOnInit() {
    this.company = this.store.getState()['activeCompany'];
    this.scopes = _.filter(this.store.getState().scopes, (company)=> {
      return company['company']['companyId'] === this.company['companyId'];
    });
    console.log('this.company: ', this.company);
    console.log('this.scopes: ', this.store.getState().scopes);
  }

  goBack(): void {
    this.location.back();
  }

  newScope() {
    this.scopeService.getScope()
    .then(scope => {
      console.log('getScope resolved: ', scope);
      this.router.navigate(['/scope']);
    })
    .catch(err => console.log('err in this.scopeService.getScope(): ', err))
  }
}
