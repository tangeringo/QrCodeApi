import { Router, Request, Response } from "express";
import { SignInProps, SignUpProps } from "../types/requestParams";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import pool from "../postgres.db.config";


dotenv.config();

const authRouter = Router();


authRouter.post("/sign-in", async (req: Request, res: Response) => {
    const { name, password }: SignInProps = req.body;

    try {
        const user = await pool('users')
            .select('id', 'password')
            .where('name', name)
            .first();

        if (!user) 
            res.status(400).json({ message: "User not found" });

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch)
            res.status(400).json({ message: "Invalid password" });

        res.status(200).json({ message: "Sign-in successful", userId: user.id });
    } catch (error) {
        console.error("An error occurred during sign-in:", error);
        res.status(500).json({ message: "An error occurred during sign-in" });
    }
    
});

authRouter.post("/sign-up", async (req: Request, res: Response) => {
    const { name, surname, password, qrCode }: SignUpProps = req.body;
  
    try {
        const hashedPassword = await bcrypt.hash(password, 10);  // Salt rounds = 10 (you can adjust it)
        await pool.transaction(async (trx) => {
            const [user] = await trx("users")
            .insert({ name, surname,  password: hashedPassword })
            .returning("id");
    
            await trx("qrcodes").insert({ id: user.id, qr_code: qrCode });
            res.status(201).json({ message: "User successfully signed up!", userId: user.id });
      });
    } catch (error) {
      console.error("Error during sign-up:", error);
      res.status(500).json({ message: "An error occurred during sign-up." + error });
    }
});
  

export default authRouter;