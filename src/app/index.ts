export { AppComponent } from './app.component';
import { Store } from './store';
import * as services from './services';

const mapValuesToArray = (obj) => Object.keys(obj).map(key=> obj[key]);

export const providers = [
    Store,
    ...mapValuesToArray(services)
];
