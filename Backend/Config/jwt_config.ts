import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const secret_key = process.env.JWT_SECRET as string;

const createToken = (user_id: string): string => {
   const newToken = jwt.sign({ user_id }, secret_key, { expiresIn: '1h' });
   return newToken;
};

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
   const authHeader = req.headers['authorization'];
   if (!authHeader) {
      return res.status(403).send('Access denied. No token provided.');
   }
   const token = authHeader.split(' ')[1];
   if (!token) {
      return res.status(403).send('Access denied. No token provided.');
   }
   jwt.verify(token, secret_key, (err, decoded) => {
      if (err) {
         return res.status(401).send('Authentication failed. Invalid token.');
      } else {
         (req as any).id = decoded;
         next();
      }
   });
};

export { createToken, verifyToken };