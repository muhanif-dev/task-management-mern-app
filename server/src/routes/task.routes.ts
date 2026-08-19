import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { verifyAuth } from '../middleware/auth.middleware';

const router = Router();

// Apply auth middleware to all task routes
router.use(verifyAuth);

router.post('/', TaskController.createTask);
router.get('/', TaskController.getTasks);
router.get('/:id', TaskController.getTaskById);
router.patch('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

export default router;