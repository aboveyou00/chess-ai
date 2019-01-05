import { Miter } from 'miter';
import { AppControllers } from './controllers';
import { AppServices } from './services';

Miter.launch({
  name: 'chess-web-api',
  port: 8081,
  allowCrossOrigin: true,
  services: AppServices,
  router: {
    path: 'api',
    controllers: AppControllers
  }
});
