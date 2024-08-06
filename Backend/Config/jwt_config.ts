import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const secret_key = process.env.JWT_SECRET as string;

const createToken = (user_id: string): string => {
   const newToken = jwt.sign({ user_id }, secret_key, { expiresIn: '5h' });
   return newToken;
};

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
   const authHeader = req.headers['authorization'];
   if (!authHeader) {
      return res.status(401).json({ message: 'Access denied. access token not valid' });
   }
   const accessToken = authHeader.split(' ')[1];
   if (!accessToken) {
      return res.status(401).json({ message: 'Access denied. access token not valid' });
   }
   jwt.verify(accessToken, secret_key, (err) => {
      if (err) {
         return res.status(401).json({ message: 'Access denied. access token not valid' });
      } else {
         next();
      }
   });
};

export { createToken, verifyToken };