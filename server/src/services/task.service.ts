import { Task, ITask } from '../models/task.model';
import { validateCreateTaskInput, validateUpdateTaskInput } from '../validators/task.validator';

export class TaskService {
  static async createTask(userId: string, data: any): Promise<{ success: boolean; status: number; message: string; data?: any; errors?: any }> {
    const validation = validateCreateTaskInput(data);
    if (!validation.isValid) {
      return {
        success: false,
        status: 400,
        message: 'Validation failed',
        errors: validation.errors,
      };
    }

    const { title, description } = data;

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      userId,
    });

    return {
      success: true,
      status: 201,
      message: 'Task created successfully',
      data: task,
    };
  }

  static async getTasks(userId: string): Promise<{ success: boolean; status: number; message: string; data?: any }> {
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });

    return {
      success: true,
      status: 200,
      message: 'Tasks retrieved successfully',
      data: tasks,
    };
  }

  static async getTaskById(userId: string, taskId: string): Promise<{ success: boolean; status: number; message: string; data?: any }> {
    const task = await Task.findOne({ _id: taskId, userId });

    if (!task) {
      return {
        success: false,
        status: 404,
        message: 'Task not found',
      };
    }

    return {
      success: true,
      status: 200,
      message: 'Task retrieved successfully',
      data: task,
    };
  }

  static async updateTask(userId: string, taskId: string, data: any): Promise<{ success: boolean; status: number; message: string; data?: any; errors?: any }> {
    const validation = validateUpdateTaskInput(data);
    if (!validation.isValid) {
      return {
        success: false,
        status: 400,
        message: 'Validation failed',
        errors: validation.errors,
      };
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.description !== undefined) updateData.description = data.description.trim();
    if (data.completed !== undefined) updateData.completed = data.completed;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return {
        success: false,
        status: 404,
        message: 'Task not found or unauthorized',
      };
    }

    return {
      success: true,
      status: 200,
      message: 'Task updated successfully',
      data: updatedTask,
    };
  }

  static async deleteTask(userId: string, taskId: string): Promise<{ success: boolean; status: number; message: string }> {
    const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId });

    if (!deletedTask) {
      return {
        success: false,
        status: 404,
        message: 'Task not found or unauthorized',
      };
    }

    return {
      success: true,
      status: 200,
      message: 'Task deleted successfully',
    };
  }
}