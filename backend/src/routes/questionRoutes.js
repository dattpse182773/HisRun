import { Router } from 'express';
import * as controller from '../controllers/questionController.js';
import { isDatabaseConnected } from '../config/database.js';
import { HttpError } from '../middleware/errorHandler.js';

const router = Router();
router.use((req, res, next) => next(isDatabaseConnected() ? undefined : new HttpError(503, 'MongoDB chưa kết nối. Vui lòng thử lại sau.')));
router.get('/', controller.list);
router.get('/random', controller.random);
router.get('/:id', controller.detail);
router.post('/:id/answer', controller.answer);
export default router;
