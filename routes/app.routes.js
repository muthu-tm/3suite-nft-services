"use strict";

import express from "express";
const router = express.Router();

import AppController from "../lib/controllers/AppController.js";

router.get("/config", async (request, response) => {
    const appController = new AppController(response);
    await appController.getConfig(request);
});

router.get("/presigned-user-url", async (request, response) => {
    const appController = new AppController(response);
    await appController.getPresignedUserURL(request);
});

export default router;