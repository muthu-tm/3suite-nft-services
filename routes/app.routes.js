"use strict";

import express from "express";
const router = express.Router();

import AppController from "../lib/controllers/AppController.js";

router.get("/config", async (request, response) => {
    const appController = new AppController(response);
    await appController.getConfig(request);
});

export default router;