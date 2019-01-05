import { CtorT, ControllerT } from 'miter';
import { ChessController } from './chess.controller';

export const AppControllers: CtorT<ControllerT>[] = <any[]>[
  ChessController
];
