import express, { Request, Response, Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './handlers/products';
import orderRoutes from './handlers/orders';
import userRoutes from './handlers/users';

dotenv.config();

const { PORT, HOST } = process.env;
const app: Application = express();
const address = `http://${HOST}:${PORT}`;

const corsOptions = {
    origin: '*',
    methods: 'GET,PUT,POST,DELETE',
    optionsSuccessStatus: 204,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
productRoutes(app);
orderRoutes(app);
userRoutes(app);

app.get('/', (_req: Request, res: Response) => {
    res.send({
        message: 'Welcome to the API',
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${address}`);
});

export default app;
