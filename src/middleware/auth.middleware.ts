import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/jwt.utils";
import TEXT from "../utils/messages";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: TEXT.ERROR.NO_TOKEN });
      return;
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      res.status(401).json({ error: TEXT.ERROR.INVALID_TOKEN_FORMAT });
      return;
    }

    const token = parts[1];

    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: TEXT.ERROR.INVALID_TOKEN });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: TEXT.ERROR.AUTH_ERROR });
    return;
  }
};
