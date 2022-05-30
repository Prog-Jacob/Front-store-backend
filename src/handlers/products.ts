import { Request, Response, Application } from 'express';
import { authenticateToken } from '../services/dashboard';
import { ProductStore, Product } from '../modules/products';

const store = new ProductStore();

const index = async (req: Request, res: Response) => {
    const products = await store.index();
    res.json(products);
};

const show = async (req: Request, res: Response) => {
    const product = await store.show(req.params.id);
    res.json(product);
};

const create = async (req: Request, res: Response) => {
    try {
        const product: Product = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
        };
        const newProduct = await store.create(product);
        res.json(newProduct);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const edit = async (req: Request, res: Response) => {
    try {
        const product: Product = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
        };
        const newProduct = await store.edit(req.params.id, product);
        res.json(newProduct);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const drop = async (req: Request, res: Response) => {
    const deletedProduct = await store.delete(req.params.id);
    res.json(deletedProduct);
};

const productsByCategory = async (req: Request, res: Response) => {
    const products = await store.productsByCategory(req.params.category);
    res.json(products);
};

const mostPopularProducts = async (req: Request, res: Response) => {
    const products = await store.mostPopularProducts(req.params.number);
    res.json(products);
};

export default function productRoutes(app: Application): void {
    app.get('/products', index);
    app.get('/products/:id', show);
    app.post('/products', authenticateToken, create);
    app.put('/products/:id', authenticateToken, edit);
    app.delete('/products/:id', authenticateToken, drop);
    app.get('/products/category/:category', productsByCategory);
    app.get('/products/popular/:number', mostPopularProducts);
}
