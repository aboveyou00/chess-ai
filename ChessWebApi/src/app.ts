import { Miter } from 'miter';
import { AppControllers } from './controllers';
import { AppServices } from './services';

Miter.launch({
  port: 8080,
  services: AppServices,
  controllers: AppControllers
});
