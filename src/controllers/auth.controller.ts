import { Request, Response } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { LoginDto, RegisterDto } from "../dto/auth.dto";
import { generateToken } from "../utils/jwt.utils";
import TEXT from "../utils/messages";

const userRepository = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const registerDto = plainToClass(RegisterDto, req.body);
    const errors = await validate(registerDto);

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}).join(", "))
        .join("; ");
      res.status(400).json({ error: errorMessages });
      return;
    }

    const { email, password, firstName, lastName } = req.body;

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: TEXT.ERROR.USER_EXIST });
      return;
    }

    const user = new User();
    user.email = email;
    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;

    await userRepository.save(user);

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: TEXT.SUCCESS.REGISTER_SUCCESS,
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: TEXT.ERROR.REGISTER_FAILED });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const loginDto = plainToClass(LoginDto, req.body);
    const errors = await validate(loginDto);

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}).join(", "))
        .join("; ");
      res.status(400).json({ error: errorMessages });
      return;
    }

    const { email, password } = loginDto;

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ error: TEXT.ERROR.LOGIN_FAILED });
      return;
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ error: TEXT.ERROR.LOGIN_FAILED });
      return;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: TEXT.SUCCESS.LOGIN_SUCCESS,
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: TEXT.ERROR.LOGIN_FAILED });
  }
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: TEXT.ERROR.UNAUTHORIZED });
      return;
    }

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: TEXT.ERROR.USER_NOT_FOUND });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: TEXT.ERROR.NO_PROFILE });
  }
};
