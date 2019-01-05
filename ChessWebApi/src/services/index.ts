import { CtorT, ServiceT } from 'miter';

import { ChessService } from './chess.service';

export const AppServices: CtorT<ServiceT>[] = [
  ChessService
];
