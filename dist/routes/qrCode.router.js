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
const dotenv_1 = __importDefault(require("dotenv"));
const postgres_db_config_1 = __importDefault(require("../postgres.db.config"));
dotenv_1.default.config();
const qrCodeRouter = (0, express_1.Router)();
qrCodeRouter.put("/validate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, qrCode } = req.body;
    try {
        const qrCodeRecord = yield (0, postgres_db_config_1.default)('qrcodes')
            .select('qr_code', 'access')
            .where('id', id)
            .first();
        if (!qrCodeRecord)
            res.status(404).json({ message: "QR code record not found for this user." });
        if (qrCode === qrCodeRecord.qr_code) {
            yield (0, postgres_db_config_1.default)('qrcodes')
                .where('id', id)
                .update({ access: 'GRANTED' });
            res.status(200).json({ message: "QR code validated. Access granted." });
        }
        else {
            yield (0, postgres_db_config_1.default)('qrcodes')
                .where('id', id)
                .update({ access: 'DENIED' });
            res.status(400).json({ message: "QR code does not match. Access denied." });
        }
    }
    catch (error) {
        console.error("Error during QR code validation:", error);
        res.status(500).json({ message: "An error occurred while validating the QR code." });
    }
}));
qrCodeRouter.get("/get-access-status/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const qrCodeRecord = yield (0, postgres_db_config_1.default)('qrcodes')
            .select('access')
            .where('id', id)
            .first();
        if (!qrCodeRecord)
            res.status(404).json({ message: "QR code record not found for this user." });
        res.status(201).json({ message: "QR code found, sending access status", status: qrCodeRecord.access });
    }
    catch (error) {
        console.error("Error during access status retrieving:", error);
        res.status(500).json({ message: "An error occurred while retrieving the access status." });
    }
}));
qrCodeRouter.get("/get-user-info/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield (0, postgres_db_config_1.default)('users')
            .select('name', 'surname')
            .where('id', id)
            .first();
        if (!user)
            res.status(400).json({ message: "User not found" });
        res.status(200).json({ message: "Retrieved data successfuly", user: { name: user.name, surname: user.surname } });
    }
    catch (error) {
        console.error("An error occurred during retrieving user data:", error);
        res.status(500).json({ message: "An error occurred during retrieving user data" });
    }
}));
exports.default = qrCodeRouter;
