"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const postgres_db_config_1 = __importDefault(require("../postgres.db.config"));
dotenv_1.default.config();
const authRouter = (0, express_1.Router)();
authRouter.post("/sign-in", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password } = req.body;
    try {
        const user = yield (0, postgres_db_config_1.default)('users')
            .select('id', 'password')
            .where('name', name)
            .first();
        if (!user)
            res.status(400).json({ message: "User not found" });
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch)
            res.status(400).json({ message: "Invalid password" });
        res.status(200).json({ message: "Sign-in successful", userId: user.id });
    }
    catch (error) {
        console.error("An error occurred during sign-in:", error);
        res.status(500).json({ message: "An error occurred during sign-in" });
    }
}));
authRouter.post("/sign-up", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, surname, password, qrCode } = req.body;
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10); // Salt rounds = 10 (you can adjust it)
        yield postgres_db_config_1.default.transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            const [user] = yield trx("users")
                .insert({ name, surname, password: hashedPassword })
                .returning("id");
            yield trx("qrcodes").insert({ id: user.id, qr_code: qrCode });
            res.status(201).json({ message: "User successfully signed up!", userId: user.id });
        }));
    }
    catch (error) {
        console.error("Error during sign-up:", error);
        res.status(500).json({ message: "An error occurred during sign-up." + error });
    }
}));
exports.default = authRouter;
