"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// Routers
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const welcome_router_1 = __importDefault(require("./routes/welcome.router"));
const qrCode_router_1 = __importDefault(require("./routes/qrCode.router"));
dotenv_1.default.config();
const port = process.env.SERVER_PORT || 3000; // Default to 3000 if not specified
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Body parsing middleware
app.use((0, cors_1.default)()); // Cross-Origin Resource Sharing middleware
// Set up routes
app.use("/home", welcome_router_1.default);
app.use("/auth", auth_router_1.default); // Ensure this is properly imported and set up
app.use("/qr-code", qrCode_router_1.default);
app.listen(port, () => {
    console.log(`QR-Code Server is listening on port ${port}`);
});
// npx ts-node src/server.ts
// npm run dev -> nodemon
