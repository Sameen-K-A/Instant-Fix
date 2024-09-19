import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import HTTP_statusCode from '../Enums/httpStatusCode';

dotenv.config();

const secret_key = process.env.JWT_SECRET as string;
const accessTokenTime = process.env.Access_Token_Expirey_Time as string;
const refreshTokenTime = process.env.Refresh_Token_Expirey_Time as string;

const createToken = (user_id: string): string => {
   return jwt.sign({ user_id }, secret_key, { expiresIn: accessTokenTime });
};

const createRefreshToken = (user_id: string): string => {
   return jwt.sign({ user_id }, secret_key, { expiresIn: refreshTokenTime });
};

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const accessToken: string = req.cookies.AccessToken;
      if (accessToken) {
         jwt.verify(accessToken, secret_key, async (err, decoded) => {
            if (err) {
               await handleRefreshToken(req, res, next);
            } else {
               const { user_id } = decoded as jwt.JwtPayload;
               req.user_id = user_id;
               next();
            };
         });
      } else {
         await handleRefreshToken(req, res, next);
      };
   } catch (error) {
      res.status(HTTP_statusCode.Unauthorized).json({ message: 'Access denied. Access token not valid.' });
   };
};

const handleRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
   const refreshToken: string = req.cookies.RefreshToken;
   if (refreshToken) {
      jwt.verify(refreshToken, secret_key, (err, decoded) => {
         if (err) {
            return res.status(HTTP_statusCode.Unauthorized).json({ message: 'Access denied. Refresh token not valid.' });
         } else {
            const { user_id } = decoded as jwt.JwtPayload;
            if (!user_id) {
               return res.status(HTTP_statusCode.Unauthorized).json({ message: 'Access denied. Token payload invalid.' });
            } else {
               const newAccessToken = createToken(user_id);
               req.user_id = user_id;
               res.cookie("AccessToken", newAccessToken, {
                  httpOnly: true,
                  sameSite: 'strict',
                  maxAge: 15 * 60 * 1000,
               });
               next();
            };
         };
      });
   } else {
      return res.status(HTTP_statusCode.Unauthorized).json({ message: 'Access denied. Refresh token not provided.' });
   };
};

export { createToken, verifyToken, createRefreshToken };






/////////////////////////////////////////////////////////////// for handlling admin jsonwebtoken ////////////////////////////////////////////////



export const adminVerifyToken = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const accessToken: string = req.cookies.AdminAccessToken;
      if (accessToken) {
         jwt.verify(accessToken, secret_key, async (err, decoded) => {
            if (err) {
               await handleAdminRefreshToken(req, res, next);
            } else {
               next();
            };
         });
      } else {
         await handleAdminRefreshToken(req, res, next);
      };
   } catch (error) {
      res.status(HTTP_statusCode.Unauthorized).json({ message: 'Access denied. Access token not valid.' });
   };
};

const handleAdminRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
   const refreshToken: string = req.cookies.AdminRefreshToken;
   if (refreshToken) {
      jwt.verify(refreshToken, secret_key, (err, decoded) => {
         if (err) {
            return res.status(HTTP_statusCode.Unauthorized).json({ message: 'Access denied. Refresh token not valid.' });
         } else {
            const { user_id } = decoded as jwt.JwtPayload;
            if (!user_id) {
               return res.status(HTTP_statusCode.Unauthorized).json({ message: 'Access denied. Token payload invalid.' });
            } else {
               const newAccessToken = createToken(user_id);
               res.cookie("AdminAccessToken", newAccessToken, {
                  httpOnly: true,
                  sameSite: 'strict',
                  maxAge: 15 * 60 * 1000,
               });
               next();
            };
         };
      });
   } else {
      return res.status(HTTP_statusCode.Unauthorized).json({ message: 'Access denied. Refresh token not provided.' });
   };
};