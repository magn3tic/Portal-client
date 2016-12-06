import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {Store} from './app/store';
import * as services from './app/services';
declare var CONFIG: any

const mapValuesToArray = (obj) => Object.keys(obj).map(key=> obj[key]);

export const providers = [
    Store,
    ...mapValuesToArray(services)
];

console.log('CONFIG: ', CONFIG)

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));