"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConfig = {
    client: process.env.PG_CLIENT,
    connection: {
        host: process.env.PG_HOST,
        port: Number(process.env.PG_PORT),
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
    },
    pool: {
        min: Number(process.env.PG_MIN_CONNECTION),
        max: Number(process.env.PG_MAX_CONNECTION)
    }
};
const pool = (0, knex_1.default)(dbConfig);
exports.default = pool;
