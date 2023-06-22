"use strict";

import express from "express";
const router = express.Router();

import NFTController from "../lib/controllers/NFTController.js";

router.post("/file", async (request, response) => {
    const nftController = new NFTController(response);
    await nftController.uploadToIPFS(request);
});

export default router;