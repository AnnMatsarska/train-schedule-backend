import jwt from "jsonwebtoken";
import { appConfig } from "../config/app";

export interface TokenPayload {
  userId: string;
  email: string;
}

export const generateToken = (payload: TokenPayload): string => {
  //   @ts-ignore
  return jwt.sign(payload, appConfig.jwt.secret, {
    expiresIn: appConfig.jwt.expiresIn,
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, appConfig.jwt.secret) as TokenPayload;
};
