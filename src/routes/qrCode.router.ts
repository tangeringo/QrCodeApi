import { Router } from "express";
import { Request, Response } from "express";
import dotenv from 'dotenv';
import pool from "../postgres.db.config";
import { QrCodeProps } from "../types/requestParams";


dotenv.config();

const qrCodeRouter = Router();

qrCodeRouter.put("/validate", async (req: Request, res: Response) => {
    const { id, qrCode }: QrCodeProps = req.body;

    try {
        const qrCodeRecord = await pool('info')
            .select('qr_code', 'access')
            .where('id', id)
            .first();
        
        if (!qrCodeRecord) 
            res.status(404).json({ message: "QR code record not found for this user." });

        if (qrCode === qrCodeRecord.qr_code) {
            await pool('info')
                .where('id', id)
                .update({ access: 'GRANTED' });
            res.status(200).json({ message: "QR code validated. Access granted." });
        } else {
            await pool('info')
                .where('id', id)
                .update({ access: 'DENIED' });
            res.status(400).json({ message: "QR code does not match. Access denied." });
        }
    } catch (error) {
        console.error("Error during QR code validation:", error);
        res.status(500).json({ message: "An error occurred while validating the QR code." });
    }
});

qrCodeRouter.get("/get-access-status/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const qrCodeRecord = await pool('info')
        .select('access')
        .where('id', id)
        .first();

        if (!qrCodeRecord) 
            res.status(404).json({ message: "QR code record not found for this user." });

        res.status(201).json({ message: "QR code found, sending access status", status: qrCodeRecord.access });

    } catch (error) {
        console.error("Error during access status retrieving:", error);
        res.status(500).json({ message: "An error occurred while retrieving the access status." });
    }
});

qrCodeRouter.get("/get-user-info/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await pool('info')
            .select('name', 'surname')
            .where('id', id)
            .first();

        if (!user) 
            res.status(400).json({ message: "User not found" });

        res.status(200).json({ message: "Retrieved data successfuly", user: {name: user.name, surname: user.surname} });
    } catch (error) {
        console.error("An error occurred during retrieving user data:", error);
        res.status(500).json({ message: "An error occurred during retrieving user data" });
    }
});

export default qrCodeRouter;