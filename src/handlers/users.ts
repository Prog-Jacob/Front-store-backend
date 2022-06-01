/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../services/dashboard';
import { Request, Response, Application } from 'express';
import { UserStore, User } from '../modules/users';

dotenv.config();

const store = new UserStore();

const index = async (req: Request, res: Response) => {
    try {
        const users = await store.index();
        res.json(users);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const user = await store.show(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const user: User = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password,
        };
        const newUser = await store.create(user);

        if (newUser) {
            const token = jwt.sign(newUser, process.env.JWT_SECRET!);
            res.json(token);
        }
        res.status(401);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const edit = async (req: Request, res: Response) => {
    try {
        const user: User = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password,
        };
        const newUser = await store.edit(req.params.id, user);
        res.json(newUser);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const drop = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const deletedUser = await store.delete(id);
        res.json(deletedUser);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const authenticatePassword = async (req: Request, res: Response) => {
    try {
        const user = await store.authenticatePassword(
            req.params.id,
            req.body.password
        );
        if (user) {
            res.json({
                message: "You're logged in!",
            });
        } else {
            res.status(401);
            res.json({
                message: 'Invalid credentials!',
            });
        }
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

export default function userRoutes(app: Application) {
    app.get('/users', authenticateToken, index);
    app.get('/users/:id', authenticateToken, show);
    app.get('/users/:id/auth', authenticateToken, authenticatePassword);
    app.post('/users', create);
    app.put('/users/:id', authenticateToken, edit);
    app.delete('/users/:id', authenticateToken, drop);
}
