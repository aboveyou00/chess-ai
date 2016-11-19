import { Miter } from 'miter';
import { AppControllers } from './controllers';
import { AppServices } from './services';

Miter.launch({
  port: 8081,
  allowCrossOrigin: true,
  path: 'api',
  services: AppServices,
  controllers: AppControllers
});
