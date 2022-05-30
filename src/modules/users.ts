import { bcryptPassword } from '../services/dashboard';
import Client from '../database';

export type User = {
    id?: number;
    firstname: string;
    lastname: string;
    password: string;
};

export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await Client.connect();
            const result = await conn.query('SELECT * FROM users');

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Couldn't get users => ${err}`);
        }
    }

    async show(id: string): Promise<User> {
        try {
            const conn = await Client.connect();
            const result = await conn.query(
                'SELECT * FROM users WHERE id = $1',
                [id]
            );

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Couldn't get user => ${err}`);
        }
    }

    async create(u: User): Promise<User> {
        try {
            const sql =
                'INSERT INTO users (firstname, lastname, password) VALUES ($1, $2, $3) RETURNING *';
            const conn = await Client.connect();
            const hashedPassword = bcryptPassword(u.password, 'hash');
            const result = await conn.query(sql, [
                u.firstname,
                u.lastname,
                hashedPassword,
            ]);

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Couldn't create user => ${err}`);
        }
    }

    async edit(id: string, u: User): Promise<User> {
        try {
            const sql =
                'UPDATE users SET firstname = $1, lastname = $2, password = $3 WHERE id = $4 RETURNING *';
            const conn = await Client.connect();
            const hashedPassword = bcryptPassword(u.password, 'hash');
            const result = await conn.query(sql, [
                u.firstname,
                u.lastname,
                hashedPassword,
                id,
            ]);

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Couldn't update user => ${err}`);
        }
    }

    async delete(id: string): Promise<User> {
        try {
            const sql = 'DELETE FROM users WHERE id = $1 RETURNING *';
            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Couldn't delete user => ${err}`);
        }
    }

    async authenticatePassword(id: string, password: string): Promise<boolean> {
        try {
            const sql = 'SELECT * FROM users WHERE id = $1';
            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);

            conn.release();

            const user = result.rows[0];
            const assert = bcryptPassword(password, 'compare', user.password);
            if (typeof assert === 'boolean') return assert;
            throw new Error("Couldn't authenticate password");
        } catch (err) {
            throw new Error(`Couldn't authenticate password => ${err}`);
        }
    }
}
