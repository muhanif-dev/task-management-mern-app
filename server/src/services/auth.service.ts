import bcrypt from 'bcrypt';
import { User, IUser } from '../models/user.model';
import { validateSignupInput } from '../validators/auth.validator';

export class AuthService {
  static async signup(data: any): Promise<{ success: boolean; status: number; message: string; data?: any; errors?: any }> {
    // 1. Validate input
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

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return {
        success: false,
        status: 409,
        message: 'Email already exists',
      };
    }

    // 3. Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Create and save new user
    const newUser =await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    // 5. Return sanitized user object (exclude passwordHash)
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
}