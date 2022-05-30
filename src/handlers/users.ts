/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response, Application } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { authenticateToken } from '../services/dashboard';
import { UserStore, User } from '../modules/users';

dotenv.config();

const store = new UserStore();

const index = async (req: Request, res: Response) => {
    const users = await store.index();
    res.json(users);
};

const show = async (req: Request, res: Response) => {
    const user = await store.show(req.params.id);
    res.json(user);
};

const create = async (req: Request, res: Response) => {
    try {
        const user: User = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password,
        };
        const newUser = await store.create(user);

        if (newUser) {
            const token = jwt.sign(newUser, process.env.JWT_AUTH_TOKEN!);
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
            firstname: req.body.firstname,
            lastname: req.body.lastname,
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
    const id = req.params.id;
    // compare id with user id from token
    const deletedUser = await store.delete(id);
    res.json(deletedUser);
};

const authenticatePassword = async (req: Request, res: Response) => {
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
};

export default function userRoutes(app: Application) {
    app.get('/users', authenticateToken, index);
    app.get('/users/:id', authenticateToken, show);
    app.get('/users/:id/auth', authenticateToken, authenticatePassword);
    app.post('/users', create);
    app.put('/users/:id', authenticateToken, edit);
    app.delete('/users/:id', authenticateToken, drop);
}
