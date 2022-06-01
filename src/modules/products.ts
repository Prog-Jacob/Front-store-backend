import Client from '../database';

export type Product = {
    id?: number;
    name: string;
    price: number;
    category: string;
};

export class ProductStore {
    async index(): Promise<Product[]> {
        try {
            const conn = await Client.connect();
            const result = await conn.query('SELECT * FROM products');

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Couldn't get products => ${err}`);
        }
    }

    async show(id: string): Promise<Product> {
        try {
            const conn = await Client.connect();
            const result = await conn.query(
                'SELECT * FROM products WHERE id = $1',
                [id]
            );

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Couldn't get product => ${err}`);
        }
    }

    async create(p: Product): Promise<Product> {
        try {
            const sql =
                'INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *';
            const conn = await Client.connect();
            const result = await conn.query(sql, [p.name, p.price, p.category]);

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Couldn't create product => ${err}`);
        }
    }

    async edit(id: string, p: Product): Promise<Product> {
        try {
            const sql =
                'UPDATE products SET name = $1, price = $2, category = $3 WHERE id = $4 RETURNING *';
            const conn = await Client.connect();
            const result = await conn.query(sql, [
                p.name,
                p.price,
                p.category,
                id,
            ]);

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Couldn't update product => ${err}`);
        }
    }

    async delete(id: string): Promise<Product> {
        try {
            const sql = 'DELETE FROM products WHERE id = $1 RETURNING *';
            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Couldn't delete product => ${err}`);
        }
    }

    async productsByCategory(category: string): Promise<Product[]> {
        try {
            const sql = 'SELECT * FROM products WHERE category = $1';
            const conn = await Client.connect();
            const result = await conn.query(sql, [category]);

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Couldn't get product by category => ${err}`);
        }
    }

    async mostPopularProducts(number: string): Promise<Product[]> {
        try {
            const sql = `SELECT id, name, quantity FROM products INNER JOIN orders_products ON products.id = orders_products.product_id GROUP BY id, name, quantity ORDER BY COUNT(id) DESC LIMIT $1`;
            const conn = await Client.connect();
            const result = await conn.query(sql, [number]);

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Couldn't get most popular products => ${err}`);
        }
    }
}
