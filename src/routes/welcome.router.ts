import { Router, Request, Response } from "express";

const welcomeRouter = Router();
welcomeRouter.get("/welcome", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server,")
});

export default welcomeRouter;