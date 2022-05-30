import Client from '../database';

export type Order = {
    id?: number;
    userid: number;
    productid: number;
    quantity: number;
    status?: string;
};

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const sql = 'SELECT * FROM orders';
            const conn = await Client.connect();
            const result = await conn.query(sql);

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Couldn't get orders => ${err}`);
        }
    }

    async show(id: string): Promise<Order> {
        try {
            const sql = 'SELECT * FROM orders WHERE id = $1';
            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Couldn't get order => ${err}`);
        }
    }

    async create(o: Order): Promise<Order> {
        try {
            const sql =
                'INSERT INTO orders (userid, productid, quantity, status) VALUES ($1, $2, $3, $4) RETURNING *';
            const conn = await Client.connect();
            const result = await conn.query(sql, [
                o.userid,
                o.productid,
                o.quantity,
                'active',
            ]);

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Couldn't create order => ${err}`);
        }
    }
    async complete(id: string): Promise<Order> {
        try {
            const sql =
                'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *';
            const conn = await Client.connect();
            const result = await conn.query(sql, ['complete', id]);

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Couldn't complete order => ${err}`);
        }
    }

    async delete(id: string): Promise<Order> {
        try {
            const sql = 'DELETE FROM orders WHERE id = $1 RETURNING *';
            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Couldn't delete order => ${err}`);
        }
    }

    async currentOrder(
        userid: string
    ): Promise<{ productid: number; name: string; quantity: number }[]> {
        try {
            const sql =
                'SELECT productid, name, quantity FROM orders INNER JOIN products ON orders.productid = products.id WHERE orders.userid = $1 AND orders.status = $2';
            const conn = await Client.connect();
            const result = await conn.query(sql, [userid, 'active']);

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Couldn't get current order => ${err}`);
        }
    }

    async completeOrder(
        userid: string
    ): Promise<{ productid: number; name: string; quantity: number }[]> {
        try {
            const sql =
                'SELECT productid, name, quantity FROM orders INNER JOIN products ON orders.productid = products.id WHERE orders.userid = $1 AND orders.status = $2';
            const conn = await Client.connect();
            const result = await conn.query(sql, [userid, 'complete']);

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Couldn't get completed order => ${err}`);
        }
    }
}
