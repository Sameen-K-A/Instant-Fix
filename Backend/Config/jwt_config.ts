import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import HTTP_statusCode from '../Enums/httpStatusCode';

dotenv.config();

const secret_key = process.env.JWT_SECRET as string;
const accessTokenTime = process.env.Access_Token_Expirey_Time as string;
const refreshTokenTime = process.env.Refresh_Token_Expirey_Time as string;
const userAccessTokenName = process.env.userAccessTokenName as string;
const userRefreshTokenName = process.env.userRefreshTokenName as string;
const adminAccessTokenName = process.env.adminAccessTokenName as string;
const adminRefreshTokenName = process.env.adminRefreshTokenName as string;
const userRole = process.env.userRole as string;
const adminRole = process.env.adminRole as string;

const createToken = (user_id: string, role: string): string => {
   return jwt.sign({ user_id, role }, secret_key, { expiresIn: accessTokenTime });
};

const createRefreshToken = (user_id: string, role: string): string => {
   return jwt.sign({ user_id, role }, secret_key, { expiresIn: refreshTokenTime });
};

const jwtverifyToken = (accessTokenName: string, refreshTokenName: string, expectedRole: string) => {
   return async (req: Request, res: Response, next: NextFunction) => {
      try {
         const accessToken: string = req.cookies[accessTokenName];
         if (accessToken) {
            jwt.verify(accessToken, secret_key, async (err, decoded) => {
               if (err) {
                  await handleRefreshToken(req, res, next, accessTokenName, refreshTokenName, expectedRole);
               } else {
                  const { user_id, role } = decoded as jwt.JwtPayload;
                  if (role !== expectedRole) {
                     res.status(HTTP_statusCode.Unauthorized).json({ message: 'Access denied. Invalid role.' });
                  } else {
                     req.user_id = user_id;
                     next();
                  };
               };
            });
         } else {
            await handleRefreshToken(req, res, next, accessTokenName, refreshTokenName, expectedRole);
         };
      } catch (error) {
         res.status(HTTP_statusCode.Unauthorized).json({ message: 'Access denied. Access token not valid.' });
      };
   };
};

const handleRefreshToken = async (req: Request, res: Response, next: NextFunction, accessTokenName: string, refreshTokenName: string, expectedRole: string) => {
   const refreshToken: string = req.cookies[refreshTokenName];
   if (refreshToken) {
      jwt.verify(refreshToken, secret_key, (err, decoded) => {
         if (err) {
            return res.status(HTTP_statusCode.Unauthorized).json({ message: 'Access denied. Refresh token not valid.' });
         } else {
            const { user_id, role } = decoded as jwt.JwtPayload;
            if (!user_id || role !== expectedRole) {
               return res.status(HTTP_statusCode.Unauthorized).json({ message: 'Access denied. Token payload invalid.' });
            } else {
               const newAccessToken = createToken(user_id, role);
               res.cookie(accessTokenName, newAccessToken, {
                  httpOnly: true,
                  sameSite: 'none',
                  secure: true,
                  maxAge: 15 * 60 * 1000,
               });
               req.user_id = user_id;
               next();
            };
         };
      });
   } else {
      return res.status(HTTP_statusCode.Unauthorized).json({ message: 'Access denied. Refresh token not provided.' });
   };
};

export const verifyToken = jwtverifyToken(userAccessTokenName, userRefreshTokenName, userRole);
export const adminVerifyToken = jwtverifyToken(adminAccessTokenName, adminRefreshTokenName, adminRole);
export { createToken, createRefreshToken };