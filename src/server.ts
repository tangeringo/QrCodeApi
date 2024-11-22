import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";

// Routers
import authRouter from "./routes/auth.router";
import welcomingRouter from "./routes/welcome.router";
import qrCodeRouter from "./routes/qrCode.router";

dotenv.config();
const port = process.env.SERVER_PORT || 3000; // Default to 3000 if not specified

const app: Express = express();
app.use(express.json());  // Body parsing middleware
app.use(cors());          // Cross-Origin Resource Sharing middleware

// Set up routes
app.use("/home", welcomingRouter);
app.use("/auth", authRouter);  // Ensure this is properly imported and set up
app.use("/qr-code", qrCodeRouter);

app.listen(port, () => {
  console.log(`QR-Code Server is listening on port ${port}`);
});


// npx ts-node src/server.ts
// npm run dev -> nodemon