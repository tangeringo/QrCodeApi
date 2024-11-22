import knex from 'knex';
import { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();
const dbConfig: Knex.Config = {
    client: process.env.PG_CLIENT as string,
    connection: {
        host: process.env.PG_HOST as string,
        port: Number(process.env.PG_PORT as string),
        user: process.env.PG_USER as string,
        password: process.env.PG_PASSWORD as string,
        database: process.env.PG_DATABASE as string,
    },
    pool: { 
        min: Number(process.env.PG_MIN_CONNECTION as string), 
        max: Number(process.env.PG_MAX_CONNECTION as string) 
    }
};

const pool = knex(dbConfig);
export default pool;