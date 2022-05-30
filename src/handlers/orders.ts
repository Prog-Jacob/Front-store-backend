import { Request, Response, Application } from 'express';
import { Order, OrderStore } from '../modules/orders';
import { authenticateToken } from '../services/dashboard';

const store = new OrderStore();

const index = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await store.index();
        res.json(orders);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const order = await store.show(req.params.id);
        res.json(order);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const order: Order = {
            productid: req.body.productid,
            userid: req.body.userid,
            quantity: req.body.quantity,
        };
        const newOrder = await store.create(order);
        res.json(newOrder);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const drop = async (req: Request, res: Response) => {
    try {
        const order = await store.delete(req.params.id);
        res.json(order);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const complete = async (req: Request, res: Response) => {
    try {
        const order = await store.complete(req.params.id);
        res.json(order);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const currentOrder = async (req: Request, res: Response) => {
    try {
        const order = await store.currentOrder(req.params.id);
        res.json(order);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const completeOrder = async (req: Request, res: Response) => {
    try {
        const order = await store.completeOrder(req.params.id);
        res.json(order);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

export default function orderRoutes(app: Application): void {
    app.get('/orders', index);
    app.get('/orders/:id', show);
    app.post('/orders', create);
    app.put('/orders/:id', complete);
    app.delete('/orders/:id', drop);
    app.get('/orders/:id/current', authenticateToken, currentOrder);
    app.get('/orders/:id/complete', authenticateToken, completeOrder);
}
