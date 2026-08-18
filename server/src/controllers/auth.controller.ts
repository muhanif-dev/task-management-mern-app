import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.signup(req.body);
      
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
      console.error('Signup error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}