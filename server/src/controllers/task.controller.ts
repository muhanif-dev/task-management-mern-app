import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';

export class TaskController {
  static async createTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const result = await TaskService.createTask(userId, req.body);

      if (!result.success) {
        res.status(result.status).json({
          success: false,
          message: result.message,
          errors: result.errors,
        });
        return;
      }

      res.status(result.status).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const result = await TaskService.getTasks(userId);

      res.status(result.status).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const taskId = req.params.id as string;
      const result = await TaskService.getTaskById(userId, taskId);

      if (!result.success) {
        res.status(result.status).json({ success: false, message: result.message });
        return;
      }

      res.status(result.status).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error('Get task by id error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const taskId = req.params.id as string;
      const result = await TaskService.updateTask(userId, taskId, req.body);

      if (!result.success) {
        res.status(result.status).json({
          success: false,
          message: result.message,
          errors: result.errors,
        });
        return;
      }

      res.status(result.status).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const taskId = req.params.id as string;
      const result = await TaskService.deleteTask(userId, taskId);

      if (!result.success) {
        res.status(result.status).json({ success: false, message: result.message });
        return;
      }

      res.status(result.status).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}