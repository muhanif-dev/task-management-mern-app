import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { validateSignupInput, validateSigninInput } from '../validators/auth.validator';

export class AuthService {
  static async signup(data: any): Promise<{ success: boolean; status: number; message: string; data?: any; errors?: any }> {

    const validation = validateSignupInput(data);
    if (!validation.isValid) {
      return {
        success: false,
        status: 400,
        message: 'Validation failed',
        errors: validation.errors,
      };
    }

    const { name, email, password } = data;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return {
        success: false,
        status: 409,
        message: 'Email already exists',
      };
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };

    return {
      success: true,
      status: 201,
      message: 'User registered successfully',
      data: userResponse,
    };
  }

  static async signin(data: any): Promise<{ success: boolean; status: number; message: string; data?: any; errors?: any }> {
    // 1. Validate input
    const validation = validateSigninInput(data);
    if (!validation.isValid) {
      return {
        success: false,
        status: 400,
        message: 'Validation failed',
        errors: validation.errors,
      };
    }

    const { email, password } = data;

    // 2. Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return {
        success: false,
        status: 401,
        message: 'Invalid email or password',
      };
    }

    // 3. Verify password      allways false??
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return {
        success: false,
        status: 401,
        message: 'Invalid email or password',
      };
    }

    // 4. Generate JWT token  Expose??
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // 5. Return token and sanitized user info
    return {
      success: true,
      status: 200,
      message: 'Signed in successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    };
  }
}