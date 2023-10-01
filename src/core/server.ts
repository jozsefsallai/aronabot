import express from 'express';

import middleware from '../server/lib/middleware';
import router from '../server/lib/router';
import boot from '../server/lib/boot';

const app = express();

middleware(app);
router(app);
boot(app);
