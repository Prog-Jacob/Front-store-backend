import Client from '../database';

export type Order = {
    id?: number;
    user_id: number;
    product_id: number;
    quantity: number;
    status?: string;
};

export class OrderStore {
    async index(user_id: string): Promise<Order[]> {
        try {
            const sql =
                'SELECT id, product_id, quantity, status FROM orders INNER JOIN orders_products ON orders.id = orders_products.order_id WHERE user_id = $1';
            const conn = await Client.connect();
            const result = await conn.query(sql, [user_id]);

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Couldn't get all orders of user => ${err}`);
        }
    }

    async show(order_id: string): Promise<Order[]> {
        try {
            const sql =
                'SELECT user_id, product_id, quantity, status FROM orders INNER JOIN orders_products ON orders.id = orders_products.order_id WHERE order_id = $1';
            const conn = await Client.connect();
            const result = await conn.query(sql, [order_id]);

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Couldn't get order => ${err}`);
        }
    }

    async create(
        user_id: string,
        p?: { product_id: string[]; quantity: string[] }
    ): Promise<Order> {
        try {
            const sql =
                'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *';
            const conn = await Client.connect();
            const result = await conn.query(sql, [user_id, 'active']);

            conn.release();

            if (p) this.addProducts(result.rows[0].id as string, p);

            return result.rows[0];
        } catch (err) {
            throw new Error(`Couldn't create order => ${err}`);
        }
    }

    async addProducts(
        order_id: string,
        p: { product_id: string[]; quantity: string[] }
    ): Promise<string> {
        try {
            const conn = await Client.connect();

            for (let i = 0; i < p.product_id.length; i++) {
                const product_id = p.product_id[i];
                const quantity = p.quantity[i];
                const sql =
                    'INSERT INTO orders_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';
                await conn.query(sql, [order_id, product_id, quantity]);
            }

            conn.release();

            return 'All products added successfully.';
        } catch (err) {
            throw new Error(`Couldn't add products => ${err}`);
        }
    }

    async complete(order_id: string): Promise<Order> {
        try {
            const sql =
                'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *';
            const conn = await Client.connect();
            const result = await conn.query(sql, ['complete', order_id]);

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Couldn't complete order => ${err}`);
        }
    }

    async delete(order_id: string): Promise<Order> {
        try {
            const conn = await Client.connect();
            let sql = 'DELETE FROM orders_products WHERE order_id = $1';
            await conn.query(sql, [order_id]);
            sql = 'DELETE FROM orders WHERE id = $1 RETURNING *';
            const result = await conn.query(sql, [order_id]);

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Couldn't delete order => ${err}`);
        }
    }

    async activeOrder(
        user_id: string
    ): Promise<{ order_id: number; product_id: number; quantity: number }[]> {
        try {
            const sql =
                'SELECT order_id, product_id, quantity, status FROM orders INNER JOIN orders_products ON orders.id = orders_products.order_id WHERE orders.user_id = $1 AND orders.status = $2';
            const conn = await Client.connect();
            const result = await conn.query(sql, [user_id, 'active']);

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Couldn't get current order => ${err}`);
        }
    }

    async completeOrder(
        user_id: string
    ): Promise<{ order_id: number; product_id: number; quantity: number }[]> {
        try {
            const sql =
                'SELECT order_id, product_id, quantity, status FROM orders INNER JOIN orders_products ON orders.id = orders_products.order_id WHERE orders.user_id = $1 AND orders.status = $2';
            const conn = await Client.connect();
            const result = await conn.query(sql, [user_id, 'complete']);

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Couldn't get completed order => ${err}`);
        }
    }
}
