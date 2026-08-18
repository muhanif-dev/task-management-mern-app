import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export const verifyAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // Attach userId to request object    TS??
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};