"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const welcomeRouter = (0, express_1.Router)();
welcomeRouter.get("/welcome", (req, res) => {
    res.send("Express + TypeScript Server,");
});
exports.default = welcomeRouter;
