/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const { PEPPER, SALT_ROUNDS, JWT_SECRET } = process.env;

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401);

        jwt.verify(token, JWT_SECRET!);
        next();
    } catch (err) {
        res.status(401);
        res.json(err);
    }
};

export const bcryptPassword = (
    password: string,
    process: string,
    hashed?: string
): string | boolean | undefined => {
    if (process === 'hash') {
        return bcrypt.hashSync(password + PEPPER, parseInt(SALT_ROUNDS!));
    } else if (process === 'compare' && hashed) {
        return bcrypt.compareSync(password + PEPPER, hashed);
    }
};
