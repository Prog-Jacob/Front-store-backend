/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
    ENV,
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DB,
    POSTGRES_DB_TEST,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
} = process.env;

let client!: Pool;

if (ENV == 'test') {
    client = new Pool({
        host: POSTGRES_HOST,
        port: parseInt(POSTGRES_PORT!),
        database: POSTGRES_DB_TEST,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
    });
} else if (ENV == 'dev') {
    client = new Pool({
        host: POSTGRES_HOST,
        port: parseInt(POSTGRES_PORT!),
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
    });
}

export default client;
