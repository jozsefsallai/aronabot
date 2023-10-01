import { Application } from 'express';

import * as gachaController from '../controllers/gachaController';
import * as studentsController from '../controllers/studentsController';

export default function router(app: Application) {
  // students routes (debug)
  app.get('/students', studentsController.index);

  // gacha routes
  app.get('/gacha', gachaController.get);
  app.get('/gacha/simulate', gachaController.simulate); // debug route
}
