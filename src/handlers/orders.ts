import { Request, Response, Application } from 'express';
import { OrderStore } from '../modules/orders';
import { authenticateToken } from '../services/dashboard';

const store = new OrderStore();

const index = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await store.index(req.params.userId);
        res.json(orders);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const order = await store.show(req.params.orderId);
        res.json(order);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const newOrder = await store.create(req.params.userId);
        res.json(newOrder);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const addProducts = async (req: Request, res: Response) => {
    try {
        const products = {
            product_id: req.body.product_id as string[],
            quantity: req.body.quantity as string[],
        };
        const added = await store.addProducts(req.params.orderId, products);
        res.json(added);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const drop = async (req: Request, res: Response) => {
    try {
        const order = await store.delete(req.params.orderId);
        res.json(order);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const complete = async (req: Request, res: Response) => {
    try {
        const order = await store.complete(req.params.orderId);
        res.json(order);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const activeOrder = async (req: Request, res: Response) => {
    try {
        const order = await store.activeOrder(req.params.userId);
        res.json(order);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const completeOrder = async (req: Request, res: Response) => {
    try {
        const order = await store.completeOrder(req.params.userId);
        res.json(order);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

export default function orderRoutes(app: Application): void {
    app.get('/orders/:userId', authenticateToken, index);
    app.get('/orders/:orderId/show', authenticateToken, show);
    app.post('/orders/:userId', authenticateToken, create);
    app.post('/orders/:orderId/add', authenticateToken, addProducts);
    app.delete('/orders/:orderId', authenticateToken, drop);
    app.put('/orders/:orderId', authenticateToken, complete);
    app.get('/orders/:userId/active', authenticateToken, activeOrder);
    app.get('/orders/:userId/complete', authenticateToken, completeOrder);
}
